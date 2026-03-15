import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  const userPayload = (req as any).user;
  if (!userPayload) return res.status(401).json({ message: "Unauthorized" });

  const { id, role } = userPayload;

  try {
    if (role === 'ADMIN' || role === 'DOCTOR') {
      const [totalPatients, totalAppointments, activeDoctors, newReports] = await Promise.all([
        prisma.user.count({ where: { role: 'PATIENT' } }),
        prisma.appointment.count(),
        prisma.user.count({ where: { role: 'DOCTOR' } }),
        prisma.report.count({ 
          where: { createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 1)) } } 
        })
      ]);

      const upcomingAppointments = await prisma.appointment.findMany({
        take: 5,
        orderBy: { date: 'asc' }, 
        include: { 
          patient: { include: { user: { select: { name: true } } } },
          doctor: { include: { user: { select: { name: true } } } }
        }
      });

      return res.json({
        stats: [
          { label: 'Total Patients', value: totalPatients.toLocaleString(), color: 'blue' },
          { label: 'Appointments', value: totalAppointments.toString(), color: 'purple' },
          { label: 'Active Doctors', value: activeDoctors.toString(), color: 'green' },
          { label: 'New Reports', value: newReports.toString(), color: 'orange' }
        ],
        appointments: upcomingAppointments.map(app => ({
          id: app.id,
          patient: app.patient.user.name, 
          doctor: app.doctor.user.name,   
          time: new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: app.status
        }))
      });
    } 

    if (role === 'PATIENT') {
      const patientRecord = await prisma.patient.findUnique({ where: { userId: id } });
      if (!patientRecord) return res.status(404).json({ message: "Patient profile not found" });

      const pId = patientRecord.id;

      const nextAppointment = await prisma.appointment.findFirst({
        where: { patientId: pId, date: { gte: new Date() } }, 
        orderBy: { date: 'asc' }
      });

      const activeMedsCount = await prisma.medication.count({ where: { patientId: pId, status: 'ACTIVE' } });
      const reportsCount = await prisma.report.count({ where: { patientId: pId } });

      const mySchedule = await prisma.appointment.findMany({
        where: { patientId: pId },
        take: 5,
        orderBy: { date: 'asc' },
        include: { 
          doctor: { include: { user: { select: { name: true } } } } 
        }
      });

      return res.json({
        stats: [
          { 
            label: 'Next Visit', 
            value: nextAppointment ? new Date(nextAppointment.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'None', 
            color: 'blue' 
          },
          { label: 'Active Meds', value: activeMedsCount.toString().padStart(2, '0'), color: 'orange' },
          { label: 'Lab Reports', value: reportsCount.toString(), color: 'purple' },
          { label: 'Health Score', value: '92%', color: 'green' }
        ],
        appointments: mySchedule.map(app => ({
          id: app.id,
          patient: app.doctor.user.name, 
          time: new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: app.status
        }))
      });
    }
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard data fetch failed" });
  }
};