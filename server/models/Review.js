import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  foodQuality: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);
