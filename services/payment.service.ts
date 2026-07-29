// services/payment.service.ts
import Payment, {
    IPayment,
    PaymentStatus,
} from "@/models/Payment";
import Product from "@/models/Product";
import User, { IUser, UserRole } from "@/models/User";
import { NotificationType } from "@/models/Notification";
import { NotificationService } from "@/services/notification.service";
import { ProductService } from "@/services/product.service";
import {
    CreatePaymentInput,
    ProcessPaymentInput,
    CompletePaymentInput,
    FailPaymentInput,
    RefundPaymentInput,
    PaymentFiltersInput,
    PaymentWebhookInput
} from "@/schema/payment.schema";

export class PaymentService {

    // ============ CREATE PAYMENT ============
    static async create(user: IUser, data: CreatePaymentInput): Promise<IPayment> {
        const product = await Product.findOne({ _id: data.productId, isDeleted: false });
        if (!product) throw new Error("Product not found.");

        const existingPayment = await Payment.findOne({
            productId: data.productId,
            status: { $in: [PaymentStatus.PENDING, PaymentStatus.PROCESSING, PaymentStatus.COMPLETED] },
            isDeleted: false
        });
        if (existingPayment) throw new Error(`Payment already exists with status: ${existingPayment.status}`);

        const reference = Payment.generateReference();
        const payment = await Payment.create({
            ...data,
            reference,
            userId: user._id,
            status: PaymentStatus.PENDING,
            initiatedAt: new Date(),
            createdBy: user._id,
            customerName: data.customerName || user.name,
            customerEmail: data.customerEmail || user.email
        });

        product.paymentStatus = 'pending';
        await product.save();

        // Notify admins
        await NotificationService.notifyAdmins(
            "Payment Created",
            `Payment ${payment.reference} of $${payment.amount} created for ${product.name}`,
            NotificationType.INFO
        );

        return payment;
    }

    // ============ PROCESS PAYMENT ============
    static async processPayment(user: IUser, data: ProcessPaymentInput): Promise<IPayment> {
        const payment = await Payment.findOne({ _id: data.paymentId, isDeleted: false });
        if (!payment) throw new Error("Payment not found.");
        if (payment.status !== PaymentStatus.PENDING) {
            throw new Error(`Payment cannot be processed. Current status: ${payment.status}`);
        }

        payment.status = PaymentStatus.PROCESSING;
        payment.processingAt = new Date();
        payment.updatedBy = user._id;
        await payment.save();

        try {
            const gatewayResult = await this.callPaymentGateway(payment);
            if (gatewayResult.success && gatewayResult.transactionId) {
                return await this.completePayment(payment._id as string, user, {
                    transactionId: gatewayResult.transactionId,
                    gatewayResponse: gatewayResult
                });
            } else {
                return await this.failPayment(payment._id as string, user, {
                    reason: gatewayResult.error || "Payment gateway failed",
                    gatewayResponse: gatewayResult
                });
            }
        } catch (error: any) {
            return await this.failPayment(payment._id as string, user, {
                reason: error.message || "Payment processing failed",
                gatewayResponse: { error: error.message }
            });
        }
    }

    // ============ COMPLETE PAYMENT ============
    static async completePayment(id: string, user: IUser | null, data: CompletePaymentInput): Promise<IPayment> {
        const payment = await Payment.findOne({ _id: id, isDeleted: false });
        if (!payment) throw new Error("Payment not found.");
        if (payment.status === PaymentStatus.COMPLETED) throw new Error("Payment already completed.");

        payment.status = PaymentStatus.COMPLETED;
        payment.completedAt = new Date();
        payment.gatewayTransactionId = data.transactionId;
        payment.gatewayResponse = data.gatewayResponse;
        if (user) payment.updatedBy = user._id;
        await payment.save();

        const product = await Product.findOne({ _id: payment.productId, isDeleted: false });
        if (product && user) {
            product.paymentStatus = 'cleared';
            product.paymentClearedDate = new Date();
            product.paymentReference = payment.reference;
            product.paymentMethod = payment.method;
            product.paymentAmount = payment.amount;
            product.currentStatus = 'payment_cleared';
            await product.save();

            await ProductService.updateStatus(product._id.toString(), user, {
                status: 'payment_cleared',
                remarks: `Payment ${payment.reference} cleared`
            });
        }

        // Notify admins
        await NotificationService.notifyAdmins(
            "Payment Completed",
            `Payment ${payment.reference} of $${payment.amount} completed successfully`,
            NotificationType.SUCCESS
        );

        // Notify buyer
        if (user) {
            await NotificationService.create(
                payment.userId.toString(),
                "Payment Successful",
                `Your payment of $${payment.amount} was successful. Reference: ${payment.reference}`,
                NotificationType.INFO
            );
        }

        return payment;
    }

    // ============ FAIL PAYMENT ============
    static async failPayment(id: string, user: IUser | null, data: FailPaymentInput): Promise<IPayment> {
        const payment = await Payment.findOne({ _id: id, isDeleted: false });
        if (!payment) throw new Error("Payment not found.");
        if (payment.status === PaymentStatus.COMPLETED) throw new Error("Cannot fail a completed payment.");

        payment.status = PaymentStatus.FAILED;
        payment.failedAt = new Date();
        payment.notes = data.reason;
        payment.gatewayResponse = data.gatewayResponse;
        if (user) payment.updatedBy = user._id;
        await payment.save();

        const product = await Product.findOne({ _id: payment.productId, isDeleted: false });
        if (product) {
            product.paymentStatus = 'failed';
            await product.save();
        }

        // Notify admins
        await NotificationService.notifyAdmins(
            "Payment Failed",
            `Payment ${payment.reference} failed. Reason: ${data.reason}`,
            NotificationType.ERROR
        );

        // Notify buyer
        if (user) {
            await NotificationService.create(
                payment.userId.toString(),
                "Payment Failed",
                `Your payment of $${payment.amount} failed. Reason: ${data.reason}`,
                NotificationType.ERROR
            );
        }

        return payment;
    }

    // ============ REFUND PAYMENT ============
    static async refundPayment(id: string, user: IUser, data: RefundPaymentInput): Promise<IPayment> {
        const payment = await Payment.findOne({ _id: id, isDeleted: false });
        if (!payment) throw new Error("Payment not found.");
        if (payment.status !== PaymentStatus.COMPLETED) {
            throw new Error(`Cannot refund payment with status: ${payment.status}`);
        }

        const refundAmount = data.amount || payment.amount;
        if (refundAmount > payment.amount) throw new Error("Refund amount cannot exceed payment amount.");

        const refundResult = await this.processRefund(payment, refundAmount);
        if (!refundResult.success) throw new Error("Refund processing failed");

        payment.status = refundAmount === payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;
        payment.refundedAt = new Date();
        payment.refundAmount = refundAmount;
        payment.refundReason = data.reason;
        payment.refundReference = data.reference || refundResult.reference;
        payment.updatedBy = user._id;
        await payment.save();

        const product = await Product.findOne({ _id: payment.productId, isDeleted: false });
        if (product) {
            product.paymentStatus = refundAmount === payment.amount ? 'refunded' : 'partially_refunded';
            await product.save();
        }

        // Notify admins
        await NotificationService.notifyAdmins(
            "Payment Refunded",
            `Payment ${payment.reference} refunded $${refundAmount}`,
            NotificationType.WARNING
        );

        // Notify buyer
        await NotificationService.create(
            payment.userId.toString(),
            "Payment Refunded",
            `Your payment of $${refundAmount} has been refunded.`,
            NotificationType.INFO
        );

        return payment;
    }

    // ============ GET PAYMENT BY ID ============
    static async findById(id: string): Promise<IPayment> {
        const payment = await Payment.findOne({ _id: id, isDeleted: false })
            .populate('productId')
            .populate('orderId')
            .populate('shipmentId')
            .populate('userId', 'name email')
            .populate('createdBy', 'name email');

        if (!payment) throw new Error("Payment not found.");
        return payment;
    }

    // ============ FIND ALL PAYMENTS ============
    static async findAll(user: IUser, filters?: PaymentFiltersInput): Promise<IPayment[]> {
        const query: any = { isDeleted: false };

        if (filters) {
            if (filters.status) query.status = filters.status;
            if (filters.method) query.method = filters.method;
            if (filters.gateway) query.gateway = filters.gateway;
            if (filters.productId) query.productId = filters.productId;
            if (filters.userId) query.userId = filters.userId;

            if (filters.search) {
                query.$or = [
                    { reference: { $regex: filters.search, $options: 'i' } },
                    { transactionId: { $regex: filters.search, $options: 'i' } },
                    { customerName: { $regex: filters.search, $options: 'i' } },
                    { customerEmail: { $regex: filters.search, $options: 'i' } }
                ];
            }

            if (filters.fromDate || filters.toDate) {
                query.createdAt = {};
                if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
                if (filters.toDate) query.createdAt.$lte = filters.toDate;
            }
        }

        return Payment.find(query)
            .populate('productId', 'name sku')
            .populate('orderId', 'orderNumber')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
    }

    // ============ GET PAYMENTS BY PRODUCT ============
    static async findByProduct(productId: string): Promise<IPayment[]> {
        return Payment.find({ productId, isDeleted: false }).sort({ createdAt: -1 });
    }

    // ============ GET PAYMENTS BY USER ============
    static async findByUser(userId: string): Promise<IPayment[]> {
        return Payment.find({ userId, isDeleted: false })
            .populate('productId', 'name sku')
            .sort({ createdAt: -1 });
    }

    // ============ PROCESS WEBHOOK ============
    static async processWebhook(data: PaymentWebhookInput): Promise<IPayment> {
        let payment = data.reference
            ? await Payment.findOne({ reference: data.reference })
            : await Payment.findOne({ gatewayTransactionId: data.transactionId });

        if (!payment) throw new Error("Payment not found for webhook");

        payment.webhookReceived = data.gatewayResponse;
        payment.webhookProcessed = true;

        const status = data.status.toLowerCase();
        switch (status) {
            case 'completed':
            case 'success':
            case 'paid':
                await this.completePayment(payment._id as string, null, {
                    transactionId: data.transactionId || payment.gatewayTransactionId || '',
                    gatewayResponse: data.gatewayResponse
                });
                break;
            case 'failed':
            case 'error':
                await this.failPayment(payment._id as string, null, {
                    reason: `Webhook: ${data.event}`,
                    gatewayResponse: data.gatewayResponse
                });
                break;
            case 'refunded':
                await this.refundPayment(payment._id as string, null as any, {
                    amount: data.amount || payment.amount,
                    reason: `Webhook refund: ${data.event}`,
                    reference: data.reference
                });
                break;
        }

        await payment.save();
        return payment;
    }

    // ============ STATISTICS ============
    static async getStats(): Promise<any> {
        const [total, completed, failed, refunded, totalAmount] = await Promise.all([
            Payment.countDocuments({ isDeleted: false }),
            Payment.countDocuments({ isDeleted: false, status: PaymentStatus.COMPLETED }),
            Payment.countDocuments({ isDeleted: false, status: PaymentStatus.FAILED }),
            Payment.countDocuments({
                isDeleted: false,
                status: { $in: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED] }
            }),
            Payment.aggregate([
                { $match: { isDeleted: false, status: PaymentStatus.COMPLETED } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        return {
            total,
            completed,
            failed,
            refunded,
            totalAmount: totalAmount[0]?.total || 0
        };
    }

    // ============ PRIVATE HELPERS ============

    private static async callPaymentGateway(payment: IPayment): Promise<any> {
        // Simulate payment gateway call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const success = Math.random() < 0.9;
        return success
            ? { success: true, transactionId: `TXN-${Date.now()}-${Math.random()}` }
            : { success: false, error: "Payment gateway declined" };
    }

    private static async processRefund(payment: IPayment, amount: number): Promise<any> {
        // Simulate refund processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, reference: `REF-${Date.now()}-${Math.random()}` };
    }
}