import "dotenv/config";
import { app } from "./app";
import { prisma } from "./lib/prisma";
import { ensureSeed } from "./seed";

const port = Number(process.env.PORT || 3333);

async function main() {
  await ensureSeed();
  app.listen(port, "0.0.0.0", () => {
    console.log(`Pixel Burguer ouvindo em 0.0.0.0:${port}`);
  });
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
