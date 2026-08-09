import express from 'express';
import { signup, login, me, refresh, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticateToken, me);
router.put('/profile', authenticateToken, updateProfile);

export default router;
