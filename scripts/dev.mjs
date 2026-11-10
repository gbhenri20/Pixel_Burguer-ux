import { spawn } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} saiu com código ${code}`));
    });
  });
}

const envPath = join(root, "server", ".env");
const examplePath = join(root, "server", ".env.example");
if (!existsSync(envPath) && existsSync(examplePath)) {
  copyFileSync(examplePath, envPath);
}

if (!existsSync(join(root, "node_modules", "concurrently"))) {
  console.log("Instalando dependências da raiz...");
  await run("npm", ["install"], root);
}
if (!existsSync(join(root, "server", "node_modules"))) {
  console.log("Instalando dependências do servidor...");
  await run("npm", ["install"], join(root, "server"));
}
if (!existsSync(join(root, "web2", "node_modules"))) {
  console.log("Instalando dependências do frontend...");
  await run("npm", ["install"], join(root, "web2"));
}

await run("npm", ["run", "dev:raw"], root);
