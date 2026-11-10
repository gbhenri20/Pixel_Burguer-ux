import type { Coupon } from "@prisma/client";
import { HttpError, round2 } from "../lib/errors";
import { prisma } from "../lib/prisma";
import {
  MAX_ITEM_QUANTITY,
  cartInclude,
  quoteCart,
  type CartWithRelations,
} from "../lib/serialize";

export function assertCouponValid(coupon: Coupon, subtotal: number) {
  if (!coupon.active) throw new HttpError(400, "Cupom inativo.");
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    throw new HttpError(400, "Cupom expirado.");
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    throw new HttpError(400, "Cupom esgotado.");
  }
  if (subtotal < coupon.minSubtotal) {
    throw new HttpError(
      400,
      `Pedido mínimo de R$ ${coupon.minSubtotal.toFixed(2)} para o cupom ${coupon.code}.`,
    );
  }
}

async function loadCart(where: { userId: string } | { sessionId: string }) {
  return prisma.cart.findUnique({ where, include: cartInclude });
}

export async function resolveCart(identity: { userId?: string; sessionId?: string }) {
  if (identity.userId) {
    const existing = await loadCart({ userId: identity.userId });
    if (existing) return existing;
    try {
      return await prisma.cart.create({
        data: { userId: identity.userId },
        include: cartInclude,
      });
    } catch {
      const again = await loadCart({ userId: identity.userId });
      if (again) return again;
      throw new HttpError(500, "Não foi possível abrir o carrinho.");
    }
  }

  if (!identity.sessionId) throw new HttpError(400, "Sessão do carrinho ausente.");

  const existing = await loadCart({ sessionId: identity.sessionId });
  if (existing) return existing;
  try {
    return await prisma.cart.create({
      data: { sessionId: identity.sessionId },
      include: cartInclude,
    });
  } catch {
    const again = await loadCart({ sessionId: identity.sessionId });
    if (again) return again;
    throw new HttpError(500, "Não foi possível abrir o carrinho.");
  }
}

async function reload(cartId: string) {
  const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude });
  if (!cart) throw new HttpError(404, "Carrinho não encontrado.");
  return cart;
}

export async function addCartItem(cart: CartWithRelations, productId: string, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(400, "Quantidade inválida.");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) throw new HttpError(404, "Produto indisponível.");
  if (product.stock <= 0) throw new HttpError(400, `${product.name} está sem estoque.`);

  const existing = cart.items.find((item) => item.productId === productId);
  const next = (existing?.quantity ?? 0) + quantity;
  if (next > product.stock) {
    throw new HttpError(400, `Estoque insuficiente de ${product.name}. Disponível: ${product.stock}.`);
  }
  if (next > MAX_ITEM_QUANTITY) {
    throw new HttpError(400, `Quantidade máxima de ${MAX_ITEM_QUANTITY} unidades por item.`);
  }

  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: next } });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity: next },
    });
  }

  return reload(cart.id);
}

export async function setCartItemQuantity(cart: CartWithRelations, productId: string, quantity: number) {
  const existing = cart.items.find((item) => item.productId === productId);
  if (!existing) throw new HttpError(404, "Item não está no carrinho.");

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
    return reload(cart.id);
  }

  if (!Number.isInteger(quantity)) throw new HttpError(400, "Quantidade inválida.");

  const product = existing.product;
  if (!product.active) throw new HttpError(400, "Produto indisponível.");
  if (quantity > product.stock) {
    throw new HttpError(400, `Estoque insuficiente de ${product.name}. Disponível: ${product.stock}.`);
  }
  if (quantity > MAX_ITEM_QUANTITY) {
    throw new HttpError(400, `Quantidade máxima de ${MAX_ITEM_QUANTITY} unidades por item.`);
  }

  await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } });
  return reload(cart.id);
}

export async function removeCartItem(cart: CartWithRelations, productId: string) {
  const existing = cart.items.find((item) => item.productId === productId);
  if (existing) await prisma.cartItem.delete({ where: { id: existing.id } });
  return reload(cart.id);
}

export async function clearCart(cart: CartWithRelations) {
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } });
  return reload(cart.id);
}

export async function applyCoupon(cart: CartWithRelations, code: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });
  if (!coupon) throw new HttpError(404, "Cupom inválido.");

  const quote = quoteCart(cart);
  if (quote.subtotal <= 0) throw new HttpError(400, "Adicione itens antes de aplicar um cupom.");
  assertCouponValid(coupon, quote.subtotal);

  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: coupon.id } });
  return reload(cart.id);
}

export async function removeCoupon(cart: CartWithRelations) {
  await prisma.cart.update({ where: { id: cart.id }, data: { couponId: null } });
  return reload(cart.id);
}

export async function mergeSessionCart(userId: string, sessionId?: string) {
  if (!sessionId) return;
  const guest = await prisma.cart.findUnique({
    where: { sessionId },
    include: cartInclude,
  });
  if (!guest) return;
  if (guest.userId === userId) return;

  let userCart = await resolveCart({ userId });
  for (const item of guest.items) {
    try {
      userCart = await addCartItem(userCart, item.productId, item.quantity);
    } catch {
      const room = Math.max(0, Math.min(item.product.stock, MAX_ITEM_QUANTITY) - (
        userCart.items.find((current) => current.productId === item.productId)?.quantity ?? 0
      ));
      if (room > 0) {
        try {
          userCart = await addCartItem(userCart, item.productId, room);
        } catch {
          /* item indisponível fica só no carrinho de origem */
        }
      }
    }
  }

  if (guest.couponId) {
    const current = await prisma.cart.findUnique({ where: { id: userCart.id } });
    if (!current?.couponId) {
      await prisma.cart.update({ where: { id: userCart.id }, data: { couponId: guest.couponId } });
    }
  }

  await prisma.cart.delete({ where: { id: guest.id } });
}

export function cartSubtotal(cart: CartWithRelations) {
  return round2(cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
}
