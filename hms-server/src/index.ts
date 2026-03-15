import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import patientRoutes from './routes/patientRoutes.js'; // 🚀 Added Patient Routes

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes); // 🚀 Mounted at /api/patients

// --- Health Check ---
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'HMS Server is running smoothly 🚀' });
});

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
  console.log(`📡 Patient API: http://localhost:${PORT}/api/patients`);
  console.log('--------------------------------------------------');
});