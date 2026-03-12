import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Invalid email or user does not exist." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials. Please try again." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      message: "Welcome back!",
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error during login." });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile from token
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true, // Included avatar field
        createdAt: true,
      }
    });

    if (!user) return res.status(404).json({ message: "User profile not found." });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ message: "Could not retrieve user profile." });
  }
};

/**
 * @route   POST /api/auth/update-avatar
 * @desc    Update user profile picture via Cloudinary
 */
export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Check if file was uploaded by Multer
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // req.file.path contains the secure URL from Cloudinary
    const imageUrl = req.file.path;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: imageUrl },
      select: {
        id: true,
        name: true,
        avatar: true
      }
    });

    return res.status(200).json({
      message: "Profile picture updated successfully!",
      avatar: updatedUser.avatar
    });

  } catch (error) {
    console.error("Avatar Update Error:", error);
    return res.status(500).json({ message: "Failed to update profile picture." });
  }
};