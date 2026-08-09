import mongoose from 'mongoose';

const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const dishSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true // e.g. "Starters", "Mains", "Desserts", "Drinks"
  },
  isVeg: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: Number,
    default: 0, // 0 to 3
    min: 0,
    max: 3
  },
  addOns: [addOnSchema],
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Dish = mongoose.model('Dish', dishSchema);
