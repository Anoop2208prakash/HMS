import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Strategy
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'hms_staff_profiles', // Specific folder for staff
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      public_id: `staff-${Date.now()}-${file.originalname.split('.')[0]}`,
      // 🚀 Transformation: Automatically resizes and crops to a perfect square on upload
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' }
      ],
    };
  },
});

// 3. Multer Middleware Configuration
export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB Limit
  }
});

export { cloudinary };