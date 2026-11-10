import type { DeliveryType, OrderStatus, PaymentMethod } from "@prisma/client";
import { HttpError, round2 } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { DELIVERY_FEE, PICKUP_FEE, STORE_ADDRESS, type CartWithRelations } from "../lib/serialize";
import { assertCouponValid } from "./cart";

const PAYMENT: Record<string, PaymentMethod> = {
  pix: "PIX",
  card: "CARD",
  cash: "CASH",
};

export interface PlaceOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  paymentMethod: "pix" | "card" | "cash";
  address?: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
  };
  userId?: string;
}

function formatAddress(input: PlaceOrderInput) {
  if (input.deliveryType === "pickup") return STORE_ADDRESS;
  const address = input.address;
  if (!address) throw new HttpError(400, "Informe o endereço de entrega.");
  const complement = address.complement?.trim() ? ` (${address.complement.trim()})` : "";
  return `${address.street}, ${address.number}${complement} — ${address.neighborhood}, ${address.city} — CEP ${address.cep}`;
}

export function nextStatus(status: OrderStatus, deliveryType: DeliveryType): OrderStatus | null {
  if (status === "RECEIVED") return "PREPARING";
  if (status === "PREPARING") return "READY";
  if (status === "READY") return deliveryType === "PICKUP" ? "DELIVERED" : "ON_THE_WAY";
  if (status === "ON_THE_WAY") return "DELIVERED";
  return null;
}

async function uniqueCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = `PB${Math.floor(10000 + Math.random() * 90000)}`;
    const exists = await prisma.order.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new HttpError(500, "Não foi possível gerar o código do pedido.");
}

export async function placeOrder(cart: CartWithRelations, input: PlaceOrderInput) {
  const activeItems = cart.items.filter((item) => item.product.active && item.quantity > 0);
  if (activeItems.length === 0) throw new HttpError(400, "O carrinho está vazio.");

  const deliveryType: DeliveryType = input.deliveryType === "pickup" ? "PICKUP" : "DELIVERY";
  const paymentMethod = PAYMENT[input.paymentMethod];
  if (!paymentMethod) throw new HttpError(400, "Forma de pagamento inválida.");
  if (deliveryType === "DELIVERY" && !input.address) {
    throw new HttpError(400, "Informe o endereço de entrega.");
  }

  const address = formatAddress(input);
  const code = await uniqueCode();

  return prisma.$transaction(async (tx) => {
    const freshItems = await tx.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });
    const lines = freshItems.filter((item) => item.product.active && item.quantity > 0);
    if (lines.length === 0) throw new HttpError(400, "O carrinho está vazio.");

    for (const line of lines) {
      if (line.quantity > line.product.stock) {
        throw new HttpError(400, `Estoque insuficiente de ${line.product.name}.`);
      }
    }

    const subtotal = round2(lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0));
    const coupon = cart.couponId
      ? await tx.coupon.findUnique({ where: { id: cart.couponId } })
      : null;

    let discountPercent = 0;
    if (coupon) {
      assertCouponValid(coupon, subtotal);
      discountPercent = coupon.discountPercent;
    }

    const discountAmount = round2((subtotal * discountPercent) / 100);
    const deliveryFee = deliveryType === "DELIVERY" ? DELIVERY_FEE : PICKUP_FEE;
    const total = round2(subtotal - discountAmount + deliveryFee);
    const units = lines.reduce((sum, line) => sum + line.quantity, 0);
    const estimatedMinutes = Math.min(60, 25 + units * 3);

    const created = await tx.order.create({
      data: {
        code,
        userId: input.userId,
        customerName: input.customerName,
        customerEmail: input.customerEmail.toLowerCase(),
        customerPhone: input.customerPhone,
        deliveryType,
        address,
        paymentMethod,
        subtotal,
        discountPercent,
        discountAmount,
        deliveryFee,
        total,
        couponCode: coupon?.code ?? null,
        estimatedMinutes,
        items: {
          create: lines.map((line) => ({
            productId: line.productId,
            name: line.product.name,
            price: line.product.price,
            quantity: line.quantity,
            image: line.product.image,
          })),
        },
      },
      include: { items: true },
    });

    for (const line of lines) {
      const updated = await tx.product.updateMany({
        where: { id: line.productId, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });
      if (updated.count !== 1) {
        throw new HttpError(400, `Estoque insuficiente de ${line.product.name}.`);
      }
    }

    if (coupon) {
      const used = await tx.coupon.updateMany({
        where: {
          id: coupon.id,
          active: true,
          ...(coupon.maxUses != null ? { usedCount: { lt: coupon.maxUses } } : {}),
        },
        data: { usedCount: { increment: 1 } },
      });
      if (used.count !== 1) throw new HttpError(400, "Cupom não pôde ser aplicado.");
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    await tx.cart.update({ where: { id: cart.id }, data: { couponId: null } });

    return created;
  });
}

export async function advanceOrder(code: string) {
  const order = await prisma.order.findUnique({ where: { code }, include: { items: true } });
  if (!order) throw new HttpError(404, "Pedido não encontrado.");
  const status = nextStatus(order.status, order.deliveryType);
  if (!status) throw new HttpError(400, "Este pedido não pode avançar.");
  return prisma.order.update({
    where: { id: order.id },
    data: { status },
    include: { items: true },
  });
}

export async function cancelOrder(code: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { code }, include: { items: true } });
    if (!order) throw new HttpError(404, "Pedido não encontrado.");
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      throw new HttpError(400, "Este pedido não pode ser cancelado.");
    }

    for (const item of order.items) {
      await tx.product.updateMany({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    if (order.couponCode) {
      await tx.coupon.updateMany({
        where: { code: order.couponCode, usedCount: { gt: 0 } },
        data: { usedCount: { decrement: 1 } },
      });
    }

    return tx.order.update({
      where: { id: order.id },
      data: { status: "CANCELLED" },
      include: { items: true },
    });
  });
}
