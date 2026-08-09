import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedAddOns: [
    {
      name: String,
      price: Number
    }
  ],
  specialInstructions: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true // e.g. "FT-9012"
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['fired', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'fired'
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod', 'wallet'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'paid'
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  riderInfo: {
    name: { type: String, default: 'Rider Alex' },
    phone: { type: String, default: '555-0199' },
    vehicle: { type: String, default: 'Red Scooter (Plate: FT-88)' }
  }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
