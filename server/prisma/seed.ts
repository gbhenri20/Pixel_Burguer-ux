import { prisma } from "../src/lib/prisma";
import { ensureSeed } from "../src/seed";

ensureSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
