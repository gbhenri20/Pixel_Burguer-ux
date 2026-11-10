import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import { parseBody } from "../lib/validate";
import { quoteCart } from "../lib/serialize";
import { asyncHandler } from "../middleware/auth";
import {
  addCartItem,
  applyCoupon,
  clearCart,
  removeCartItem,
  removeCoupon,
  resolveCart,
  setCartItemQuantity,
} from "../services/cart";

const router = Router();

async function cartFor(req: { authUser?: { id: string }; sessionId?: string }) {
  return resolveCart({ userId: req.authUser?.id, sessionId: req.sessionId });
}

router.get("/", asyncHandler(async (req, res) => {
  const cart = await cartFor(req);
  res.json(quoteCart(cart));
}));

router.post("/items", asyncHandler(async (req, res) => {
  const body = parseBody(z.object({
    productId: z.string().trim().min(1, "Informe o produto."),
    quantity: z.number().int().min(1).max(20).default(1),
  }), req.body);
  const cart = await cartFor(req);
  const updated = await addCartItem(cart, body.productId, body.quantity ?? 1);
  res.status(201).json(quoteCart(updated));
}));

router.patch("/items/:productId", asyncHandler(async (req, res) => {
  const body = parseBody(z.object({
    quantity: z.number().int().min(0).max(20),
  }), req.body);
  const cart = await cartFor(req);
  const updated = await setCartItemQuantity(cart, req.params.productId, body.quantity);
  res.json(quoteCart(updated));
}));

router.delete("/items/:productId", asyncHandler(async (req, res) => {
  const cart = await cartFor(req);
  const updated = await removeCartItem(cart, req.params.productId);
  res.json(quoteCart(updated));
}));

router.delete("/", asyncHandler(async (req, res) => {
  const cart = await cartFor(req);
  const updated = await clearCart(cart);
  res.json(quoteCart(updated));
}));

router.post("/coupon", asyncHandler(async (req, res) => {
  const body = parseBody(z.object({
    code: z.string().trim().min(2, "Informe o cupom.").max(30),
  }), req.body);
  const cart = await cartFor(req);
  const updated = await applyCoupon(cart, body.code);
  res.json(quoteCart(updated));
}));

router.delete("/coupon", asyncHandler(async (req, res) => {
  const cart = await cartFor(req);
  const updated = await removeCoupon(cart);
  res.json(quoteCart(updated));
}));

export default router;
