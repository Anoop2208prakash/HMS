import express, { Request, Response, NextFunction } from 'express'; // Fixed: Changed 'react' to 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Request Logger ---
// Fixed: Explicitly added types to req, res, and next
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'HMS Server is running smoothly 🚀' });
});

// --- API Routes ---
app.use('/api/auth', authRoutes);

// --- Global Error Handler ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log('--------------------------------------------------');
  console.log(`🚀 HMS Server started on: http://localhost:${PORT}`);
  console.log('--------------------------------------------------');
});