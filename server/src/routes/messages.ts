import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { parseBody } from "../lib/validate";
import { asyncHandler, requireRole } from "../middleware/auth";

const router = Router();

router.post("/", asyncHandler(async (req, res) => {
  const body = parseBody(z.object({
    name: z.string().trim().min(2, "Informe o nome.").max(80),
    email: z.string().trim().email("E-mail inválido.").max(120),
    subject: z.string().trim().min(2, "Informe o assunto.").max(120),
    message: z.string().trim().min(5, "Escreva a mensagem.").max(2000),
  }), req.body);

  const saved = await prisma.contactMessage.create({
    data: {
      name: body.name,
      email: body.email.toLowerCase(),
      subject: body.subject,
      message: body.message,
    },
  });

  res.status(201).json({
    id: saved.id,
    name: saved.name,
    email: saved.email,
    subject: saved.subject,
    message: saved.message,
    createdAt: saved.createdAt.toISOString(),
  });
}));

router.get("/", requireRole("ADMIN"), asyncHandler(async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  res.json(messages.map((message) => ({
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    createdAt: message.createdAt.toISOString(),
  })));
}));

export default router;
