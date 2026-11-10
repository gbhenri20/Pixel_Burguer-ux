import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import { parseBody } from "../lib/validate";
import { serializeUser } from "../lib/serialize";
import { asyncHandler, requireAuth, requireRole } from "../middleware/auth";

const router = Router();

const addressSchema = z.object({
  label: z.string().trim().min(2, "Informe um apelido.").max(40).default("Casa"),
  cep: z.string().trim().min(8, "CEP inválido.").max(12),
  street: z.string().trim().min(2, "Informe a rua.").max(120),
  number: z.string().trim().min(1, "Informe o número.").max(20),
  complement: z.string().trim().max(60).optional(),
  neighborhood: z.string().trim().min(2, "Informe o bairro.").max(80),
  city: z.string().trim().min(2, "Informe a cidade.").max(80),
  isPrimary: z.boolean().optional(),
});

function serializeAddress(address: {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  isPrimary: boolean;
}) {
  return address;
}

router.get("/", requireRole("ADMIN"), asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  res.json(users.map(serializeUser));
}));

router.patch("/:id", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const body = parseBody(z.object({
    name: z.string().trim().min(2).max(80).optional(),
    phone: z.string().trim().min(8).max(20).optional(),
    role: z.enum(["CUSTOMER", "KITCHEN", "ADMIN"]).optional(),
  }), req.body);
  const current = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!current) throw new HttpError(404, "Usuário não encontrado.");
  if (body.role && body.role !== "ADMIN" && current.id === req.authUser!.id) {
    throw new HttpError(400, "Você não pode remover o próprio acesso de administrador.");
  }
  const user = await prisma.user.update({
    where: { id: current.id },
    data: { name: body.name, phone: body.phone, role: body.role },
  });
  res.json(serializeUser(user));
}));

router.delete("/:id", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  if (req.params.id === req.authUser!.id) throw new HttpError(400, "Você não pode excluir a própria conta por aqui.");
  const current = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!current) throw new HttpError(404, "Usuário não encontrado.");
  await prisma.user.delete({ where: { id: current.id } });
  res.status(204).send();
}));

const addresses = Router();

addresses.get("/", requireAuth, asyncHandler(async (req, res) => {
  const rows = await prisma.address.findMany({
    where: { userId: req.authUser!.id },
    orderBy: [{ isPrimary: "desc" }, { label: "asc" }],
  });
  res.json(rows.map(serializeAddress));
}));

addresses.post("/", requireAuth, asyncHandler(async (req, res) => {
  const body = parseBody(addressSchema, req.body);
  const count = await prisma.address.count({ where: { userId: req.authUser!.id } });
  const isPrimary = body.isPrimary ?? count === 0;
  if (isPrimary) {
    await prisma.address.updateMany({ where: { userId: req.authUser!.id }, data: { isPrimary: false } });
  }
  const address = await prisma.address.create({
    data: {
      userId: req.authUser!.id,
      label: body.label,
      cep: body.cep,
      street: body.street,
      number: body.number,
      complement: body.complement ?? "",
      neighborhood: body.neighborhood,
      city: body.city,
      isPrimary,
    },
  });
  res.status(201).json(serializeAddress(address));
}));

const addressUpdateSchema = z.object({
  label: z.string().trim().min(2, "Informe um apelido.").max(40).optional(),
  cep: z.string().trim().min(8, "CEP inválido.").max(12).optional(),
  street: z.string().trim().min(2, "Informe a rua.").max(120).optional(),
  number: z.string().trim().min(1, "Informe o número.").max(20).optional(),
  complement: z.string().trim().max(60).optional(),
  neighborhood: z.string().trim().min(2, "Informe o bairro.").max(80).optional(),
  city: z.string().trim().min(2, "Informe a cidade.").max(80).optional(),
  isPrimary: z.boolean().optional(),
});

addresses.patch("/:id", requireAuth, asyncHandler(async (req, res) => {
  const body = parseBody(addressUpdateSchema, req.body);
  const current = await prisma.address.findFirst({
    where: { id: req.params.id, userId: req.authUser!.id },
  });
  if (!current) throw new HttpError(404, "Endereço não encontrado.");
  if (body.isPrimary) {
    await prisma.address.updateMany({ where: { userId: req.authUser!.id }, data: { isPrimary: false } });
  }
  const address = await prisma.address.update({
    where: { id: current.id },
    data: {
      label: body.label,
      cep: body.cep,
      street: body.street,
      number: body.number,
      complement: body.complement,
      neighborhood: body.neighborhood,
      city: body.city,
      isPrimary: body.isPrimary,
    },
  });
  res.json(serializeAddress(address));
}));

addresses.delete("/:id", requireAuth, asyncHandler(async (req, res) => {
  const current = await prisma.address.findFirst({
    where: { id: req.params.id, userId: req.authUser!.id },
  });
  if (!current) throw new HttpError(404, "Endereço não encontrado.");
  await prisma.address.delete({ where: { id: current.id } });
  if (current.isPrimary) {
    const next = await prisma.address.findFirst({ where: { userId: req.authUser!.id } });
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isPrimary: true } });
  }
  res.status(204).send();
}));

router.use("/me/addresses", addresses);

export default router;
