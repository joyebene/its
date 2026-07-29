import Payment, {
    IPayment,
    PaymentStatus,
} from "@/models/Payment";
import Product from "@/models/Product";
import { IUser } from "@/models/User";
import { NotificationType } from "@/models/Notification";
import { NotificationService } from "@/services/notification.service";
import {
    CreatePaymentInput,
} from "@/schema/payment.schema";


export class PaymentService {

    // ============ CREATE PAYMENT ============
    static async create(user: IUser, data: CreatePaymentInput): Promise<IPayment> {
        const product = await Product.findOne({ _id: data.productId, isDeleted: false });
        if (!product) throw new Error("Product not found.");

        const existingPayment = await Payment.findOne({
            productId: data.productId,
            status: { 
                $in: [
                    PaymentStatus.PENDING, 
                    PaymentStatus.PROCESSING, 
                    PaymentStatus.COMPLETED
                ] 
            },
            isDeleted: false
        });
        
        if (existingPayment) {
            throw new Error(`Payment already exists with status: ${existingPayment.status}`);
        }

        const reference = Payment.generateReference();
        const paymentData: any = {
            ...data,
            reference,
            userId: user._id,
            status: PaymentStatus.PENDING,
            initiatedAt: new Date(),
            createdBy: user._id,
            customerName: data.customerName || `${user.firstName} ${user.lastName}`,
            customerEmail: data.customerEmail || user.email
        };

        // Remove cardDetails if present (not in schema)
        if (paymentData.cardDetails) {
            delete paymentData.cardDetails;
        }

        const payment = await Payment.create(paymentData);

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



    // ============ GET PAYMENT BY ID ============
    static async findById(id: string): Promise<IPayment> {
        const payment = await Payment.findOne({ 
            _id: id, 
            isDeleted: false 
        })
            .populate('productId')
            .populate('orderId')
            .populate('shipmentId')
            .populate('userId', 'firstName lastName email')
            .populate('createdBy', 'firstName lastName email');

        if (!payment) throw new Error("Payment not found.");
        return payment;
    }


    // ============ GET PAYMENTS BY PRODUCT ============
    static async findByProduct(productId: string): Promise<IPayment[]> {
        return Payment.find({ 
            productId, 
            isDeleted: false 
        })
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }


}