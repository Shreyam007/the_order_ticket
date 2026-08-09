import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 150
  },
  avgPrepTime: {
    type: String,
    default: '25-35 MIN'
  },
  priceRange: {
    type: String,
    enum: ['₹', '₹₹', '₹₹₹'],
    default: '₹₹'
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  address: {
    type: String,
    default: '124 Kitchen St, Terminal 4'
  },
  bestsellerTag: {
    type: String,
    default: ''
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
