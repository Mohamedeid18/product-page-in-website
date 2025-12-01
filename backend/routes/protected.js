import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';

const router = Router();

router.get('/admin/dashboard', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome to admin dashboard' });
});

export default router;
