import { Router } from 'express';
import { 
  login, 
  register, 
  getProfile, 
  getAllStaff, 
  updateProfileImage 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Public login route
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/register
 * @desc    Create new staff/doctor/admin accounts with avatar
 * @access  Public
 */
router.post(
  '/register', 
  upload.single('avatar'), // 🚀 Key matched to frontend: data.append('avatar', ...)
  register
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user data for Navbar/Profile
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   GET /api/auth/staff-list
 * @desc    Fetch all hospital employees
 * @access  Private
 */
router.get('/staff-list', authenticateToken, getAllStaff);

/**
 * @route   POST /api/auth/update-avatar
 * @desc    Update existing user profile picture
 * @access  Private
 */
router.post(
  '/update-avatar', 
  authenticateToken, 
  upload.single('avatar'), // 🚀 Changed from 'image' to 'avatar' for consistency
  updateProfileImage
);

export default router;