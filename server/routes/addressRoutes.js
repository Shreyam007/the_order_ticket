import express from 'express';
import { getAddresses, createAddress } from '../controllers/addressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', getAddresses);
router.post('/', createAddress);

export default router;
