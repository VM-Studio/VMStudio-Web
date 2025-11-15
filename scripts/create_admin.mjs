import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Desired single admin credentials
  const email = 'vmtiendaon@gmail.com';
  const passwordPlain = 'Vmtiendaon123.';
  const hashed = await bcrypt.hash(passwordPlain, 10);

  // Demote any other ADMIN users to USER to ensure single admin
  const otherAdmins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  for (const a of otherAdmins) {
    if (a.email !== email) {
      await prisma.user.update({ where: { id: a.id }, data: { role: 'USER' } });
      console.log('Demoted existing admin to USER:', a.email);
    }
  }

  // Upsert the single admin user
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { password: hashed, role: 'ADMIN', firstName: 'VM', lastName: 'Tienda' } });
    console.log('Updated admin user password and role for:', email);
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName: 'VM',
        lastName: 'Tienda',
        role: 'ADMIN',
      },
    });
    console.log('Created admin user:', user.email, 'with password:', passwordPlain);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
