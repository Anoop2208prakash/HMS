import { Router } from 'express';
import { login, getProfile, updateProfileImage } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js'; // Import the Multer/Cloudinary config

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Public route to authenticate users
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Protected route to fetch current user's data for the Navbar/Profile
 * @access  Private (Requires valid JWT)
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   POST /api/auth/update-avatar
 * @desc    Upload profile picture to Cloudinary and update user record
 * @access  Private
 * @note    'image' is the key name expected in the frontend FormData
 */
router.post(
  '/update-avatar', 
  authenticateToken, 
  upload.single('image'), 
  updateProfileImage
);

export default router;