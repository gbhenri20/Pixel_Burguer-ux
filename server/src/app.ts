import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "./lib/errors";
import { DELIVERY_FEE, STORE_ADDRESS } from "./lib/serialize";
import { attachIdentity } from "./middleware/auth";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import couponRoutes from "./routes/coupons";
import orderRoutes from "./routes/orders";
import userRoutes from "./routes/users";
import messageRoutes from "./routes/messages";

export const app = express();

const webDist = path.resolve(__dirname, "../../web2/dist");
const webIndex = path.join(webDist, "index.html");
const hasWebBuild = fs.existsSync(webIndex);

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? true
    : [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
  allowedHeaders: ["Content-Type", "Authorization", "X-Session-Id"],
}));
app.use(express.json({ limit: "1mb" }));
app.use(attachIdentity);

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "pixel-burguer-local",
    deliveryFee: DELIVERY_FEE,
    storeAddress: STORE_ADDRESS,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

if (hasWebBuild) {
  app.use(express.static(webDist));
  app.use((req, res, next) => {
    if ((req.method !== "GET" && req.method !== "HEAD") || req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(webIndex);
  });
}

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if (typeof error === "object" && error && "status" in error && (error as { status?: number }).status === 400) {
    res.status(400).json({ error: "JSON inválido." });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor." });
});
