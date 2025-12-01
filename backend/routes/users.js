import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} from '../controllers/userController.js';

const router = Router();

// Get current user profile
router.get('/me', protect, getCurrentUser);

// Get all users (Admin only)
router.get('/', protect, authorizeRoles('admin'), getAllUsers);

// Get user by ID
router.get('/:id', protect, getUserById);

// Update user
router.put('/:id', protect, updateUser);

// Delete user (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;

