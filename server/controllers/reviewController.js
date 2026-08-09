import { Review } from '../models/Review.js';
import { eventBus } from '../sse/eventBus.js';

const MOCK_REVIEWS = new Map();

export const createReview = async (req, res) => {
  try {
    const { orderId, restaurantId, rating, foodQuality, text } = req.body;
    const customerId = req.user.id;

    if (!orderId || !rating) {
      return res.status(400).json({ message: 'Order ID and rating are required' });
    }

    let review = null;
    try {
      const doc = new Review({
        orderId,
        customerId,
        restaurantId,
        rating,
        foodQuality: foodQuality || 5,
        text: text || ''
      });
      review = await doc.save();
    } catch (e) {
      review = {
        _id: `rev_${Date.now()}`,
        orderId,
        customerId,
        restaurantId,
        rating,
        foodQuality: foodQuality || 5,
        text: text || '',
        createdAt: new Date()
      };
    }

    MOCK_REVIEWS.set(orderId.toString(), review);

    // Emit real-time SSE review:new to restaurant analytics feed
    eventBus.emitEvent('review:new', review);

    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

export const getReviewByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    let review = null;

    try {
      review = await Review.findOne({ orderId });
    } catch (e) {}

    if (!review) {
      review = MOCK_REVIEWS.get(orderId) || null;
    }

    res.json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review', error: error.message });
  }
};
