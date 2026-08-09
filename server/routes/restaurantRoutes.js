import express from 'express';
import { getRestaurants, getRestaurantById, getRestaurantMenu } from '../controllers/restaurantController.js';
import { getExpoOrders, toggleKitchenOpen, getAnalytics } from '../controllers/restaurantPartnerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/:id/menu', getRestaurantMenu);

// Protected partner routes
router.use(authenticateToken);
router.get('/my-restaurant/orders', getExpoOrders);
router.patch('/my-restaurant/toggle-open', toggleKitchenOpen);
router.get('/my-restaurant/analytics', getAnalytics);

export default router;
