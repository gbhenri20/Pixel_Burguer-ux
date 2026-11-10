import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import { parseBody } from "../lib/validate";
import { serializeOrder } from "../lib/serialize";
import { asyncHandler, requireAuth, requireRole } from "../middleware/auth";
import { resolveCart } from "../services/cart";
import { advanceOrder, cancelOrder, placeOrder } from "../services/orders";

const router = Router();

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Informe o nome.").max(80),
  customerEmail: z.string().trim().email("E-mail inválido."),
  customerPhone: z.string().trim().min(8, "Telefone inválido.").max(20),
  deliveryType: z.enum(["delivery", "pickup"]),
  paymentMethod: z.enum(["pix", "card", "cash"]),
  address: z.object({
    cep: z.string().trim().min(8, "CEP inválido.").max(12),
    street: z.string().trim().min(2, "Informe a rua.").max(120),
    number: z.string().trim().min(1, "Informe o número.").max(20),
    complement: z.string().trim().max(60).optional(),
    neighborhood: z.string().trim().min(2, "Informe o bairro.").max(80),
    city: z.string().trim().min(2, "Informe a cidade.").max(80),
  }).optional(),
});

router.post("/", asyncHandler(async (req, res) => {
  const body = parseBody(orderSchema, req.body);
  if (body.deliveryType === "delivery" && !body.address) {
    throw new HttpError(400, "Informe o endereço de entrega.");
  }
  const cart = await resolveCart({ userId: req.authUser?.id, sessionId: req.sessionId });
  const order = await placeOrder(cart, { ...body, userId: req.authUser?.id });
  res.status(201).json(serializeOrder(order));
}));

router.get("/mine", requireAuth, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.authUser!.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders.map(serializeOrder));
}));

router.get("/manage", requireRole("ADMIN", "KITCHEN"), asyncHandler(async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(orders.map(serializeOrder));
}));

router.get("/code/:code", asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { code: req.params.code.toUpperCase() },
    include: { items: true },
  });
  if (!order) throw new HttpError(404, "Pedido não encontrado.");
  res.json(serializeOrder(order));
}));

router.post("/code/:code/advance", requireRole("ADMIN", "KITCHEN"), asyncHandler(async (req, res) => {
  const order = await advanceOrder(req.params.code.toUpperCase());
  res.json(serializeOrder(order));
}));

router.post("/code/:code/cancel", requireRole("ADMIN", "KITCHEN"), asyncHandler(async (req, res) => {
  const order = await cancelOrder(req.params.code.toUpperCase());
  res.json(serializeOrder(order));
}));

export default router;
