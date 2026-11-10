import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = join(root, "server");
const webDir = join(root, "web2");
const mode = process.argv[2] || "start";

if (mode === "render-build" && process.env.RENDER !== "true") {
  process.exit(0);
}

function run(command, args, cwd, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} saiu com código ${code}`));
    });
  });
}

async function installIfMissing(dir, marker) {
  if (existsSync(marker)) return;
  console.log(`Instalando dependências em ${dir}...`);
  await run("npm", ["install", "--include=dev"], dir);
}

const env = { ...process.env };
if (!env.DATABASE_URL) {
  env.DATABASE_URL = "file:./dev.db";
  console.log("DATABASE_URL ausente. SQLite ficará em server/prisma/dev.db.");
}
if (!env.JWT_SECRET) {
  env.JWT_SECRET = "pixel-burguer-local-dev-secret";
  console.log("JWT_SECRET ausente. Defina um segredo próprio nas variáveis do Render.");
}

await installIfMissing(serverDir, join(serverDir, "node_modules", "prisma"));
await installIfMissing(webDir, join(webDir, "node_modules", "vite"));

const indexHtml = join(webDir, "dist", "index.html");
if (mode === "build" || mode === "render-build" || !existsSync(indexHtml)) {
  console.log("Gerando o frontend...");
  await run("npm", ["run", "build"], webDir, env);
}

await run("npx", ["prisma", "generate"], serverDir, env);

if (mode !== "start") {
  process.exit(0);
}

await run("npx", ["prisma", "db", "push", "--skip-generate"], serverDir, env);

const server = spawn("npx", ["tsx", "src/index.ts"], {
  cwd: serverDir,
  env: { ...env, NODE_ENV: "production" },
  stdio: "inherit",
  shell: process.platform === "win32",
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code) => process.exit(code ?? 1));
