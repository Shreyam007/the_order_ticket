import express from 'express';
import { createReview, getReviewByOrder } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/', createReview);
router.get('/order/:orderId', getReviewByOrder);

export default router;
