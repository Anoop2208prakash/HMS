import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Anoop2208', 10);
  
  await prisma.user.upsert({
    where: { email: 'anoop@hospital.com' },
    update: {},
    create: {
      email: 'anoop@hospital.com',
      name: 'Anoop Prakash',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log("✅ Admin user created: anoop@hospital.com / Anoop2208");
}

main().catch(console.error).finally(() => prisma.$disconnect());