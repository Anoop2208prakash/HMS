import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @route   POST /api/auth/register
 * @desc    Unified Registration for Staff, Doctors, and Patients
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { 
      name, email, password, role, phone, address, 
      // Patient specific
      dob, gender, bloodType,
      // Doctor specific
      specialization, department 
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists." });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Get the Cloudinary URL from Multer
    const avatarUrl = req.file ? req.file.path : "";

    // 4. Create User with Nested Profile Logic
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'PATIENT',
        avatar: avatarUrl,
        phone,
        address,
        // 🚀 Nested Write for Patient
        ...(role === 'PATIENT' && {
          patientProfile: {
            create: {
              dob: dob ? new Date(dob) : new Date(), // Convert string to Date object
              gender: gender || 'Other',
              bloodType: bloodType || null
            }
          }
        }),
        // 🚀 Nested Write for Doctor
        ...(role === 'DOCTOR' && {
          doctorProfile: {
            create: {
              specialization: specialization || "General Medicine",
              department: department || "General" 
            }
          }
        })
      },
      include: {
        patientProfile: true,
        doctorProfile: true
      }
    });

    // 🚀 FIXED: Variable name here must match the return statement below
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "Registration successful!",
      user: userWithoutPassword // 🚀 This was 'userResponse' in your error
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ 
      message: "Internal Server Error during registration.",
      error: error.message 
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token (Includes sub-profiles)
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { 
        patientProfile: true, 
        doctorProfile: true 
      }
    });

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
 * @desc    Get current user profile (Includes specific role data)
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patientProfile: true,
        doctorProfile: true
      }
    });

    if (!user) return res.status(404).json({ message: "User profile not found." });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    return res.status(500).json({ message: "Could not retrieve user profile." });
  }
};

/**
 * @route   GET /api/auth/staff-list
 * @desc    Fetch all hospital employees
 */
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'DOCTOR', 'STAFF'] } 
      },
      include: {
        doctorProfile: {
          select: { department: true, specialization: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(staff);
  } catch (error) {
    console.error("Staff Fetch Error:", error);
    return res.status(500).json({ message: "Failed to fetch staff members." });
  }
};

/**
 * @route   POST /api/auth/update-avatar
 * @desc    Update user profile picture via Multer
 */
export const updateProfileImage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

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