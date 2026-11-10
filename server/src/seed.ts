import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "./lib/prisma";
import { COUPONS, products } from "../../web2/src/data/products";

const DEMO_USERS: { name: string; email: string; phone: string; password: string; role: Role }[] = [
  {
    name: "Admin Pixel",
    email: "admin@pixelburguer.com",
    phone: "(11) 3000-0404",
    password: "admin123",
    role: "ADMIN",
  },
  {
    name: "Cozinha Pixel",
    email: "cozinha@pixelburguer.com",
    phone: "(11) 3000-0405",
    password: "cozinha123",
    role: "KITCHEN",
  },
  {
    name: "Player One",
    email: "player@pixelburguer.com",
    phone: "(11) 99999-0001",
    password: "player123",
    role: "CUSTOMER",
  },
];

const COUPON_RULES: Record<string, { minSubtotal: number; maxUses: number | null }> = {
  PIXEL10: { minSubtotal: 0, maxUses: null },
  GAMER20: { minSubtotal: 40, maxUses: null },
  LEVEL50: { minSubtotal: 20, maxUses: 100 },
};

export async function ensureSeed() {
  for (const user of DEMO_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (existing) continue;
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        passwordHash: bcrypt.hashSync(user.password, 10),
        role: user.role,
      },
    });
  }

  const player = await prisma.user.findUnique({ where: { email: "player@pixelburguer.com" } });
  if (player) {
    const addresses = await prisma.address.count({ where: { userId: player.id } });
    if (addresses === 0) {
      await prisma.address.create({
        data: {
          userId: player.id,
          label: "Casa",
          cep: "01234-567",
          street: "Av. dos Games",
          number: "404",
          complement: "",
          neighborhood: "Pixel District",
          city: "São Paulo",
          isPrimary: true,
        },
      });
    }
  }

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { id: product.id } });
    if (existing) continue;
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        ingredients: JSON.stringify(product.ingredients),
        price: product.price,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        featured: product.featured,
        popular: Boolean(product.popular),
        isNew: Boolean(product.isNew),
        active: true,
        stock: 100,
        promoOriginalPrice: product.promo?.originalPrice ?? null,
        promoDiscount: product.promo?.discount ?? null,
      },
    });
  }

  for (const [code, discountPercent] of Object.entries(COUPONS)) {
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) continue;
    const rules = COUPON_RULES[code] ?? { minSubtotal: 0, maxUses: null };
    await prisma.coupon.create({
      data: {
        code,
        discountPercent,
        minSubtotal: rules.minSubtotal,
        maxUses: rules.maxUses,
        active: true,
      },
    });
  }
}
