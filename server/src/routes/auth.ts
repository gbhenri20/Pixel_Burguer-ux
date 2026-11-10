import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import { signToken } from "../lib/auth";
import { parseBody } from "../lib/validate";
import { serializeUser } from "../lib/serialize";
import { asyncHandler, requireAuth } from "../middleware/auth";
import { mergeSessionCart } from "../services/cart";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(80, "Nome muito longo."),
  email: z.string().trim().email("E-mail inválido.").max(120),
  phone: z.string().trim().min(8, "Telefone inválido.").max(20, "Telefone inválido."),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres.").max(72, "Senha muito longa."),
});

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

const updateSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(80).optional(),
  phone: z.string().trim().min(8, "Telefone inválido.").max(20).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres.").max(72).optional(),
});

router.post("/register", asyncHandler(async (req, res) => {
  const body = parseBody(registerSchema, req.body);
  const email = body.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, "Já existe uma conta com este e-mail.");

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email,
      phone: body.phone,
      passwordHash: bcrypt.hashSync(body.password, 10),
      role: "CUSTOMER",
    },
  });

  try {
    await mergeSessionCart(user.id, req.sessionId);
  } catch (error) {
    console.error("Falha ao unir carrinho de visitante:", error);
  }
  res.status(201).json({ token: signToken({ id: user.id, role: user.role, email: user.email }), user: serializeUser(user) });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const body = parseBody(loginSchema, req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!user || !bcrypt.compareSync(body.password, user.passwordHash)) {
    throw new HttpError(401, "E-mail ou senha incorretos.");
  }
  try {
    await mergeSessionCart(user.id, req.sessionId);
  } catch (error) {
    console.error("Falha ao unir carrinho de visitante:", error);
  }
  res.json({ token: signToken({ id: user.id, role: user.role, email: user.email }), user: serializeUser(user) });
}));

router.get("/me", requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.authUser!.id } });
  if (!user) throw new HttpError(401, "Usuário não encontrado.");
  res.json(serializeUser(user));
}));

router.patch("/me", requireAuth, asyncHandler(async (req, res) => {
  const body = parseBody(updateSchema, req.body);
  const user = await prisma.user.findUnique({ where: { id: req.authUser!.id } });
  if (!user) throw new HttpError(401, "Usuário não encontrado.");

  let passwordHash: string | undefined;
  if (body.newPassword) {
    if (!body.currentPassword || !bcrypt.compareSync(body.currentPassword, user.passwordHash)) {
      throw new HttpError(400, "Senha atual incorreta.");
    }
    passwordHash = bcrypt.hashSync(body.newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name ?? user.name,
      phone: body.phone ?? user.phone,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });
  res.json(serializeUser(updated));
}));

export default router;
