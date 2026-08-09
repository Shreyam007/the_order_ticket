import express from 'express';
import { createDish, updateDish, toggleDishAvailability, deleteDish } from '../controllers/dishController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/', createDish);
router.put('/:id', updateDish);
router.patch('/:id/toggle-availability', toggleDishAvailability);
router.delete('/:id', deleteDish);

export default router;
