import "dotenv/config";
import { app } from "./app";
import { prisma } from "./lib/prisma";
import { ensureSeed } from "./seed";

const port = Number(process.env.PORT || 3333);

async function main() {
  await ensureSeed();
  app.listen(port, () => {
    console.log(`Pixel Burguer API local em http://localhost:${port}`);
  });
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
