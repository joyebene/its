// models/Product.js
import { Schema, models, model } from "mongoose";

const productSchema = new Schema({
  // Core fields
  name: { type: String, required: true },
  sku: { type: String, unique: true },
  description: String,
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  // Relations
  shipmentId: { type: Schema.Types.ObjectId, ref: 'Shipment' },
  shipmentItemId: { type: Schema.Types.ObjectId, ref: 'ShipmentItem' },
  containerId: { type: Schema.Types.ObjectId, ref: 'Container' },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },

  // Payment
  paymentStatus: {
  type: String,
  enum: [
    "PENDING",
    "PAID",
    "FAILED",
    "REFUNDED",
  ],
  default: "PENDING",
},
  paymentDate: Date,
  paymentClearedDate: Date,
  paymentReference: String,
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash']
  },
  paymentAmount: Number,

  // Buyer info
  buyerId: { type: Schema.Types.ObjectId, ref: 'User' },
  buyerEmail: String,
  buyerName: String,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },

  // Tracking
  trackingLocations: [{
    location: { type: String, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    description: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],

  // Current status
  currentStatus: {
    type: String,
    enum: [
      'order_placed',
      'payment_pending',
      'payment_cleared',
      'in_transit',
      'arrived_port',
      'customs_clearance',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ],
    default: 'order_placed'
  },

  // Timestamps
  orderedAt: { type: Date, default: Date.now },
  expectedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,

  // Metadata
  notes: String,
  tags: [String],

  // Audit fields (matching your Shipment model)
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ sku: 1 });
productSchema.index({ shipmentId: 1 });
productSchema.index({ buyerId: 1 });
productSchema.index({ currentStatus: 1 });
productSchema.index({ paymentStatus: 1 });
productSchema.index({ createdAt: -1 });

// Virtuals
productSchema.virtual('trackingCount').get(function () {
  return this.trackingLocations?.length || 0;
});

productSchema.virtual('isDelivered').get(function () {
  return this.currentStatus === 'delivered';
});

productSchema.virtual('isPaid').get(function () {
  return this.paymentStatus === 'cleared';
});

// Ensure virtuals are included
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = models.Product || model('Product', productSchema);
export default Product;