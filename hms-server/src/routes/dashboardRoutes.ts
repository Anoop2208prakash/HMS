import express from 'express';
// 🚀 FIXED: Added .js extension for ESM compatibility
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateToken, getDashboardStats);

export default router;