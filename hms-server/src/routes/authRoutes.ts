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
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/register
 * @desc    Create new staff/doctor accounts (Admin access recommended)
 */
router.post('/register', register);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user data for Navbar/Profile
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   GET /api/auth/staff-list
 * @desc    Fetch all hospital employees for the Staff Management table
 * @access  Private
 */
router.get('/staff-list', authenticateToken, getAllStaff);

/**
 * @route   POST /api/auth/update-avatar
 * @desc    Upload profile picture to Cloudinary
 * @access  Private
 */
router.post(
  '/update-avatar', 
  authenticateToken, 
  upload.single('image'), 
  updateProfileImage
);

export default router;