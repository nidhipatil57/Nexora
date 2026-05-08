const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const careers = await prisma.career.findMany();
    console.log('Careers found:', careers.length);
    console.log(JSON.stringify(careers, null, 2));
  } catch (e) {
    console.error('Prisma test error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
