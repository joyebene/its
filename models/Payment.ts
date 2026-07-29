import { Types } from "mongoose";
import { Schema, models, model, Document, Model } from "mongoose";

// ============ ENUMS ============
export enum PaymentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
    PARTIALLY_REFUNDED = 'partially_refunded',
    CANCELLED = 'cancelled'
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    CASH = 'cash',
    WALLET = 'wallet'
}

export enum PaymentGateway {
    STRIPE = 'stripe',
    PAYPAL = 'paypal',
    FLUTTERWAVE = 'flutterwave',
    PAYSTACK = 'paystack',
    MANUAL = 'manual'
}

// ============ INTERFACES ============
export interface IBillingAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface IPayment extends Document {
    // Relations
    productId: Types.ObjectId;
    shipmentId?: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    
    // Payment Details
    amount: number;
    currency: string;
    
    // Payment Status
    status: PaymentStatus;
    
    // Payment Method
    method: PaymentMethod;
    
    // Gateway Details
    gateway: PaymentGateway;
    gatewayTransactionId?: string;
    gatewayResponse?: any;
    
    // Payment References
    reference: string;
    transactionId?: string;
    
    // Card Details (tokenized/encrypted)
    cardLast4?: string;
    cardBrand?: string;
    cardExpiry?: string;
    
    // Customer Details
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    
    // Billing Address
    billingAddress?: IBillingAddress;
    
    // Payment Timeline
    initiatedAt: Date;
    processingAt?: Date;
    completedAt?: Date;
    failedAt?: Date;
    refundedAt?: Date;
    
    // Refund Details
    refundAmount?: number;
    refundReason?: string;
    refundReference?: string;
    
    // Metadata
    notes?: string;
    metadata?: any;
    
    // Webhook Data
    webhookReceived?: any;
    webhookProcessed: boolean;
    
    // Audit Fields
    isDeleted: boolean;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
    deletedBy?: Schema.Types.ObjectId;
    
    // Virtuals
    isCompleted: boolean;
    isFailed: boolean;
    isRefunded: boolean;
    
    // Methods
    markAsCompleted(transactionId: string, gatewayResponse?: any): Promise<IPayment>;
    markAsFailed(reason: string, gatewayResponse?: any): Promise<IPayment>;
    markAsRefunded(amount: number, reason: string, reference?: string): Promise<IPayment>;
}

// ============ STATICS INTERFACE ============
interface IPaymentModel extends Model<IPayment> {
    generateReference(): string;
}

// ============ SCHEMA ============
const paymentSchema = new Schema<IPayment, IPaymentModel>({
    // Relations
    productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    shipmentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Shipment' 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Payment Details
    amount: { 
        type: Number, 
        required: true 
    },
    currency: { 
        type: String, 
        default: 'USD' 
    },
    
    // Payment Status
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    
    // Payment Method
    method: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true
    },
    
    // Gateway Details
    gateway: {
        type: String,
        enum: Object.values(PaymentGateway),
        default: PaymentGateway.MANUAL
    },
    gatewayTransactionId: String,
    gatewayResponse: Schema.Types.Mixed,
    
    // Payment References
    reference: { 
        type: String, 
        unique: true 
    },
    transactionId: String,
    
    // Card Details (tokenized/encrypted)
    cardLast4: String,
    cardBrand: String,
    cardExpiry: String,
    
    // Customer Details
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    
    // Billing Address
    billingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    
    // Payment Timeline
    initiatedAt: { 
        type: Date, 
        default: Date.now 
    },
    processingAt: Date,
    completedAt: Date,
    failedAt: Date,
    refundedAt: Date,
    
    // Refund Details
    refundAmount: Number,
    refundReason: String,
    refundReference: String,
    
    // Metadata
    notes: String,
    metadata: Schema.Types.Mixed,
    
    // Webhook Data
    webhookReceived: Schema.Types.Mixed,
    webhookProcessed: { 
        type: Boolean, 
        default: false 
    },
    
    // Audit Fields
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    updatedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    deletedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, {
    timestamps: true
});

// ============ INDEXES ============
paymentSchema.index({ reference: 1 }, { unique: true });
paymentSchema.index({ gatewayTransactionId: 1 });
paymentSchema.index({ productId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// ============ VIRTUALS ============
paymentSchema.virtual('isCompleted').get(function(this: IPayment) {
    return this.status === PaymentStatus.COMPLETED;
});

paymentSchema.virtual('isFailed').get(function(this: IPayment) {
    return this.status === PaymentStatus.FAILED;
});

paymentSchema.virtual('isRefunded').get(function(this: IPayment) {
    return this.status === PaymentStatus.REFUNDED || 
           this.status === PaymentStatus.PARTIALLY_REFUNDED;
});

// ============ METHODS ============
paymentSchema.methods.markAsCompleted = async function(
    this: IPayment,
    transactionId: string,
    gatewayResponse?: any
): Promise<IPayment> {
    this.status = PaymentStatus.COMPLETED;
    this.completedAt = new Date();
    this.gatewayTransactionId = transactionId;
    if (gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }
    return this.save();
};

paymentSchema.methods.markAsFailed = async function(
    this: IPayment,
    reason: string,
    gatewayResponse?: any
): Promise<IPayment> {
    this.status = PaymentStatus.FAILED;
    this.failedAt = new Date();
    if (gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }
    this.notes = reason;
    return this.save();
};

paymentSchema.methods.markAsRefunded = async function(
    this: IPayment,
    amount: number,
    reason: string,
    reference?: string
): Promise<IPayment> {
    this.status = amount === this.amount 
        ? PaymentStatus.REFUNDED 
        : PaymentStatus.PARTIALLY_REFUNDED;
    this.refundedAt = new Date();
    this.refundAmount = amount;
    this.refundReason = reason;
    if (reference) {
        this.refundReference = reference;
    }
    return this.save();
};

// ============ STATICS ============
paymentSchema.statics.generateReference = function(): string {
    const prefix = 'PAY';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${timestamp}-${random}`;
};

// ============ TO JSON OPTIONS ============
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

// ============ MODEL ============
const Payment = (models.Payment as IPaymentModel) || 
                model<IPayment, IPaymentModel>('Payment', paymentSchema);

export default Payment;