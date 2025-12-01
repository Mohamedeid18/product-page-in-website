import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  rateOrder,
} from '../controllers/orderController.js';

const router = Router();

// All order routes require authentication
router.use(protect);

// Create order (Client only)
router.post('/', authorizeRoles('client'), createOrder);

// Get all orders (Admin gets all, Client gets their own)
router.get('/', getAllOrders);

// Get single order
router.get('/:id', getOrderById);

// Update order status (Admin only)
router.put('/:id/status', authorizeRoles('admin'), updateOrderStatus);

// Delete order (Admin only)
// Allow admin or the order owner to delete/cancel their order
router.delete('/:id', deleteOrder);

// Rate order (Client only)
router.post('/:id/rate', authorizeRoles('client'), rateOrder);

export default router;

