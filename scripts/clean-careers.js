const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  try {
    await prisma.career.deleteMany();
    console.log('Cleared Career table');
  } catch (e) {
    console.error('Clear error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
