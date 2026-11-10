import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import { parseBody } from "../lib/validate";
import { asyncHandler, requireRole } from "../middleware/auth";
import { assertCouponValid, resolveCart } from "../services/cart";
import { quoteCart } from "../lib/serialize";

const router = Router();

const couponSchema = z.object({
  code: z.string().trim().min(3, "Informe o código.").max(30).transform((value) => value.toUpperCase()),
  discountPercent: z.number().int().min(1, "Desconto inválido.").max(90),
  minSubtotal: z.number().min(0).default(0),
  maxUses: z.number().int().positive().nullable().optional(),
  active: z.boolean().default(true),
});

function serializeCoupon(coupon: {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
  minSubtotal: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
}) {
  return {
    id: coupon.id,
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    active: coupon.active,
    minSubtotal: coupon.minSubtotal,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    expiresAt: coupon.expiresAt?.toISOString() ?? null,
  };
}

router.get("/", asyncHandler(async (_req, res) => {
  const coupons = await prisma.coupon.findMany({ where: { active: true }, orderBy: { code: "asc" } });
  res.json(coupons.map((coupon) => ({
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    minSubtotal: coupon.minSubtotal,
  })));
}));

router.get("/manage", requireRole("ADMIN"), asyncHandler(async (_req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });
  res.json(coupons.map(serializeCoupon));
}));

router.post("/validate", asyncHandler(async (req, res) => {
  const body = parseBody(z.object({ code: z.string().trim().min(2) }), req.body);
  const cart = await resolveCart({ userId: req.authUser?.id, sessionId: req.sessionId });
  const quote = quoteCart(cart);
  const coupon = await prisma.coupon.findUnique({ where: { code: body.code.toUpperCase() } });
  if (!coupon) throw new HttpError(404, "Cupom inválido.");
  assertCouponValid(coupon, quote.subtotal);
  res.json({
    code: coupon.code,
    discountPercent: coupon.discountPercent,
    discountAmount: quote.subtotal * coupon.discountPercent / 100,
  });
}));

router.post("/", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const body = parseBody(couponSchema, req.body);
  const exists = await prisma.coupon.findUnique({ where: { code: body.code } });
  if (exists) throw new HttpError(409, "Já existe um cupom com este código.");
  const coupon = await prisma.coupon.create({
    data: {
      code: body.code,
      discountPercent: body.discountPercent,
      minSubtotal: body.minSubtotal,
      maxUses: body.maxUses ?? null,
      active: body.active,
    },
  });
  res.status(201).json(serializeCoupon(coupon));
}));

const couponUpdateSchema = z.object({
  code: z.string().trim().min(3, "Informe o código.").max(30).transform((value) => value.toUpperCase()).optional(),
  discountPercent: z.number().int().min(1, "Desconto inválido.").max(90).optional(),
  minSubtotal: z.number().min(0).optional(),
  maxUses: z.number().int().positive().nullable().optional(),
  active: z.boolean().optional(),
});

router.patch("/:id", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const body = parseBody(couponUpdateSchema, req.body);
  const current = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!current) throw new HttpError(404, "Cupom não encontrado.");
  if (body.code && body.code !== current.code) {
    const exists = await prisma.coupon.findUnique({ where: { code: body.code } });
    if (exists) throw new HttpError(409, "Já existe um cupom com este código.");
  }
  const coupon = await prisma.coupon.update({
    where: { id: current.id },
    data: {
      code: body.code,
      discountPercent: body.discountPercent,
      minSubtotal: body.minSubtotal,
      maxUses: body.maxUses,
      active: body.active,
    },
  });
  res.json(serializeCoupon(coupon));
}));

router.delete("/:id", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const current = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!current) throw new HttpError(404, "Cupom não encontrado.");
  await prisma.coupon.delete({ where: { id: current.id } });
  res.status(204).send();
}));

export default router;
