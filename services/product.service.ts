import Product from "@/models/Product";
import User from "@/models/User";
import { IUser, UserRole } from "@/models/User";
import { NotificationType } from "@/models/Notification";
import { NotificationService } from "@/services/notification.service";
import {
    CreateProductInput,
    UpdateProductInput,
    PaymentInput,
    PaymentClearInput,
    TrackingUpdateInput,
    BulkTrackingUpdateInput,
    UpdateProductStatusInput,
    ProductFiltersInput
} from "@/schema/product.schema";

export class ProductService {

    private static generateSKU(productName: string) {
        const prefix = productName.substring(0, 3).toUpperCase();
        const random = Math.floor(10000 + Math.random() * 90000);
        const timestamp = Date.now().toString().slice(-4);
        return `${prefix}-${random}-${timestamp}`;
    }

    private static async notifyProductUsers(
        title: string,
        message: string,
        type: NotificationType,
        productId?: string
    ) {
        const users = await User.find({
            role: {
                $in: [
                    UserRole.ADMIN,
                    UserRole.SUPER_ADMIN,
                    UserRole.LOGISTICS,
                    UserRole.WAREHOUSE,
                    UserRole.DELIVERY,
                ],
            },
            isDeleted: false,
        });

        const notifications = users.map(user => ({
            user: user._id,
            title,
            message,
            type,
            metadata: { productId }
        }));

        if (notifications.length) {
            await NotificationService.bulkCreate(notifications);
        }
    }

    private static async notifyBuyer(
        product: any,
        title: string,
        message: string
    ) {
        if (product.buyerId) {
            await NotificationService.create(
                product.buyerId.toString(),
                title,
                message,
            );
        }
    }

    // ============ CREATE PRODUCT ============
    static async create(user: IUser, data: CreateProductInput) {
        const product = await Product.create({
            ...data,
            sku: data.sku || this.generateSKU(data.name),
            paymentStatus: 'pending',
            currentStatus: 'order_placed',
            orderedAt: new Date(),
            createdBy: user._id
        });

        await this.notifyProductUsers(
            "New Product Created",
            `Product ${product.name} (SKU: ${product.sku}) has been created.`,
            NotificationType.INFO,
            product._id
        );

        return product;
    }

    // ============ FIND ALL PRODUCTS ============
    static async findAll(user: IUser, filters?: ProductFiltersInput) {
        const query: any = { isDeleted: false };

        if (filters) {
            if (filters.status) query.currentStatus = filters.status;
            if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
            if (filters.buyerId) query.buyerId = filters.buyerId;
            if (filters.shipmentId) query.shipmentId = filters.shipmentId;

            if (filters.search) {
                query.$or = [
                    { name: { $regex: filters.search, $options: 'i' } },
                    { sku: { $regex: filters.search, $options: 'i' } },
                    { description: { $regex: filters.search, $options: 'i' } }
                ];
            }

            if (filters.fromDate || filters.toDate) {
                query.createdAt = {};
                if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
                if (filters.toDate) query.createdAt.$lte = filters.toDate;
            }
        }

        return Product.find(query)
            .populate('shipmentId')
            .populate('containerId')
            .populate('orderId')
            .populate('buyerId', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
    }

    // ============ FIND PRODUCT BY ID ============
    static async findById(id: string) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        })
            .populate('shipmentId')
            .populate('containerId')
            .populate('orderId')
            .populate('buyerId', 'name email')
            .populate('createdBy', 'name email')
            .populate('trackingLocations.updatedBy', 'name email');

        if (!product) {
            throw new Error("Product not found.");
        }

        return product;
    }

    // ============ UPDATE PRODUCT ============
    static async update(id: string, user: IUser, data: UpdateProductInput) {
        const product = await Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { ...data, updatedBy: user._id },
            { new: true }
        );

        if (!product) {
            throw new Error("Product not found.");
        }

        await this.notifyProductUsers(
            "Product Updated",
            `Product ${product.name} has been updated.`,
            NotificationType.INFO,
            product._id
        );

        return product;
    }

    // ============ DELETE PRODUCT ============
    static async delete(id: string, user: IUser) {
        const product = await Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                deletedBy: user._id,
                updatedBy: user._id
            },
            { new: true }
        );

        if (!product) {
            throw new Error("Product not found.");
        }

        return product;
    }

    // ============ PROCESS PAYMENT ============
    static async processPayment(user: IUser, data: PaymentInput) {
        const product = await Product.findOne({
            _id: data.productId,
            isDeleted: false
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        if (product.paymentStatus !== 'pending') {
            throw new Error(`Payment already ${product.paymentStatus}`);
        }

        // Simulate payment gateway call
        const gatewayResponse = await this.mockPaymentGateway(data);

        if (gatewayResponse.success) {
            product.paymentStatus = 'cleared';
            product.paymentDate = new Date();
            product.paymentClearedDate = new Date();
            product.paymentReference = data.reference || gatewayResponse.transactionId;
            product.paymentMethod = data.method;
            product.paymentAmount = data.amount;
            product.currentStatus = 'payment_cleared';
            product.updatedBy = user._id;

            await product.save();

            await this.notifyProductUsers(
                "Payment Cleared",
                `Payment for ${product.name} (${product.sku}) has been cleared.`,
                NotificationType.SUCCESS,
                product._id
            );

            await this.notifyBuyer(
                product,
                "Payment Confirmed",
                `Your payment for ${product.name} has been confirmed. We'll start shipping soon!`
            );

            return {
                product,
                payment: {
                    status: 'cleared',
                    transactionId: gatewayResponse.transactionId,
                    clearedAt: product.paymentClearedDate
                }
            };
        }

        throw new Error("Payment processing failed");
    }

    private static async mockPaymentGateway(data: PaymentInput) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            amount: data.amount,
            method: data.method
        };
    }

    // ============ CLEAR PAYMENT (Manual) ============
    static async clearPayment(
        id: string,
        user: IUser,
        data: PaymentClearInput
    ) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        if (product.paymentStatus === 'cleared') {
            throw new Error("Payment already cleared.");
        }

        product.paymentStatus = 'cleared';
        product.paymentClearedDate = new Date();
        product.paymentReference = data.transactionId;
        product.currentStatus = 'payment_cleared';
        product.updatedBy = user._id;

        await product.save();

        await this.notifyProductUsers(
            "Payment Cleared (Manual)",
            `Payment for ${product.name} (${product.sku}) has been manually cleared by ${user.firstName} ${user.lastName}.`,
            NotificationType.SUCCESS,
            product._id
        );

        await this.notifyBuyer(
            product,
            "Payment Confirmed",
            `Your payment for ${product.name} has been confirmed. We'll start shipping soon!`
        );

        return product;
    }

    // ============ ADD TRACKING UPDATE ============
    static async addTrackingUpdate(
        id: string,
        user: IUser,
        data: TrackingUpdateInput
    ) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        // Validate status transition
        const validTransitions: Record<string, string[]> = {
            created: ["payment_cleared"],

            payment_cleared: ["ready_for_pickup"],

            ready_for_pickup: ["in_transit"],

            in_transit: [
                "in_transit",
                "arrived_port",
            ],

            arrived_port: [
                "customs_clearance",
            ],

            customs_clearance: [
                "out_for_delivery",
            ],

            out_for_delivery: [
                "delivered",
            ],

            delivered: [],
        };

        if (data.status !== product.currentStatus) {
            const allowed = validTransitions[product.currentStatus] || [];
            if (!allowed.includes(data.status)) {
                throw new Error(
                    `Invalid status transition from ${product.currentStatus} to ${data.status}. ` +
                    `Allowed: ${allowed.join(', ')}`
                );
            }
        }

        const trackingEntry = {
            location: data.location,
            status: data.status,
            description: data.description || `Product is ${data.status}`,
            coordinates: data.coordinates || { lat: undefined, lng: undefined },
            timestamp: new Date(),
            updatedBy: user._id
        };

        product.trackingLocations.push(trackingEntry);
        product.currentStatus = data.status;
        product.updatedBy = user._id;

        if (data.status === 'delivered') {
            product.deliveredAt = new Date();
        }

        await product.save();

        await this.notifyProductUsers(
            "Product Tracking Updated",
            `Product ${product.name} (${product.sku}) is now ${data.status} at ${data.location}.`,
            NotificationType.INFO,
            product._id
        );

        await this.notifyBuyer(
            product,
            `Product Status: ${data.status}`,
            `Your product is now ${data.status} at ${data.location}. ${data.description || ''}`
        );

        return {
            product,
            trackingEvent: trackingEntry
        };
    }

    // ============ BULK TRACKING UPDATE ============
    static async addBulkTrackingUpdates(
        id: string,
        user: IUser,
        data: BulkTrackingUpdateInput
    ) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        const addedUpdates = [];
        for (const update of data.updates) {
            const trackingEntry = {
                location: update.location,
                status: update.status,
                description: update.description || `Product is ${update.status}`,
                coordinates: update.coordinates || { lat: undefined, lng: undefined },
                timestamp: new Date(),
                updatedBy: user._id
            };

            product.trackingLocations.push(trackingEntry);
            product.currentStatus = update.status;
            addedUpdates.push(trackingEntry);
        }

        const lastUpdate = data.updates[data.updates.length - 1];
        if (lastUpdate?.status === 'delivered') {
            product.deliveredAt = new Date();
        }

        product.updatedBy = user._id;
        await product.save();

        await this.notifyProductUsers(
            "Product Tracking Updated (Bulk)",
            `Product ${product.name} has received ${data.updates.length} tracking updates.`,
            NotificationType.INFO,
            product._id
        );

        return {
            product,
            trackingEvents: addedUpdates
        };
    }

    // ============ SIMULATE FULL TRACKING JOURNEY ============
    static async simulateTracking(id: string, user: IUser) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        const journey = [
            {
                location: 'Shanghai Port, China',
                status: 'in_transit' as const,
                description: 'Product loaded on vessel MV Oceanic',
                coordinates: { lat: 31.2304, lng: 121.4737 }
            },
            {
                location: 'Singapore Transshipment Hub',
                status: 'in_transit' as const,
                description: 'Arrived at transshipment hub, waiting for next vessel',
                coordinates: { lat: 1.3521, lng: 103.8198 }
            },
            {
                location: 'Rotterdam Port, Netherlands',
                status: 'arrived_port' as const,
                description: 'Arrived at destination port, awaiting customs',
                coordinates: { lat: 51.9244, lng: 4.4777 }
            },
            {
                location: 'Customs Clearance, Rotterdam',
                status: 'customs_clearance' as const,
                description: 'Customs clearance in progress',
                coordinates: { lat: 51.9244, lng: 4.4777 }
            },
            {
                location: 'Amsterdam Distribution Center',
                status: 'out_for_delivery' as const,
                description: 'Out for delivery to buyer',
                coordinates: { lat: 52.3676, lng: 4.9041 }
            },
            {
                location: product.shippingAddress?.city || 'Buyer Address',
                status: 'delivered' as const,
                description: 'Delivered to buyer',
                coordinates: { lat: undefined, lng: undefined }
            }
        ];

        const results = [];
        for (const update of journey) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const result = await this.addTrackingUpdate(
                id,
                user,
                update
            );
            results.push(result);
        }

        return {
            product: results[results.length - 1].product,
            trackingEvents: results.map(r => r.trackingEvent)
        };
    }

    // ============ GET TRACKING HISTORY ============
    static async getTrackingHistory(id: string) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        })
            .select('trackingLocations currentStatus')
            .populate('trackingLocations.updatedBy', 'name email');

        if (!product) {
            throw new Error("Product not found.");
        }

        return {
            currentStatus: product.currentStatus,
            trackingHistory: product.trackingLocations,
            totalUpdates: product.trackingLocations.length
        };
    }

    // ============ UPDATE PRODUCT STATUS ============
    static async updateStatus(
        id: string,
        user: IUser,
        data: UpdateProductStatusInput
    ) {
        const product = await Product.findOne({
            _id: id,
            isDeleted: false
        });

        if (!product) {
            throw new Error("Product not found.");
        }

        product.currentStatus = data.status;
        product.updatedBy = user._id;

        if (data.status === 'delivered') {
            product.deliveredAt = new Date();
        }

        if (data.status === 'cancelled') {
            product.cancelledAt = new Date();
        }

        await product.save();

        await this.notifyProductUsers(
            "Product Status Updated",
            `Product ${product.name} status changed to ${data.status}. ${data.remarks || ''}`,
            NotificationType.WARNING,
            product._id
        );

        return product;
    }

    // ============ GET STATISTICS ============
    static async getStats() {
        const total = await Product.countDocuments({ isDeleted: false });
        const delivered = await Product.countDocuments({
            isDeleted: false,
            currentStatus: 'delivered'
        });
        const inTransit = await Product.countDocuments({
            isDeleted: false,
            currentStatus: {
                $in: ['in_transit', 'arrived_port', 'customs_clearance', 'out_for_delivery']
            }
        });
        const pendingPayment = await Product.countDocuments({
            isDeleted: false,
            paymentStatus: 'pending'
        });
        const cancelled = await Product.countDocuments({
            isDeleted: false,
            currentStatus: 'cancelled'
        });

        return {
            total,
            delivered,
            inTransit,
            pendingPayment,
            cancelled
        };
    }
}