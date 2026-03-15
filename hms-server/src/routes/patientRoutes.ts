import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        appointments: { take: 1, orderBy: { date: 'desc' }, select: { date: true } }
      }
    });

    const formatted = patients.map(p => ({
      id: p.id,
      name: p.user.name,
      email: p.user.email,
      phone: p.user.phone,
      gender: p.gender,
      bloodType: p.bloodType,
      dob: p.dob,
      lastVisit: p.appointments[0]?.date || null
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

export default router;