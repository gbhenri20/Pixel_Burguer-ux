import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import { parseBody } from "../lib/validate";
import { serializeProduct } from "../lib/serialize";
import { asyncHandler, requireRole } from "../middleware/auth";

const router = Router();

const categories = ["burgers", "sides", "sandwiches", "drinks", "desserts", "combos"] as const;

const categorySchema = z.string().trim().refine(
  (value): value is (typeof categories)[number] => categories.includes(value as (typeof categories)[number]),
  "Categoria inválida.",
);

const productSchema = z.object({
  id: z.string().trim().min(2).max(40).optional(),
  name: z.string().trim().min(2, "Informe o nome.").max(80),
  category: categorySchema,
  description: z.string().trim().min(3, "Informe a descrição.").max(800),
  ingredients: z.array(z.string().trim().min(1)).max(20).default([]),
  price: z.number().positive("Preço inválido.").max(9999),
  image: z.string().trim().min(1, "Informe a imagem."),
  stock: z.number().int().min(0, "Estoque inválido.").max(100000).default(100),
  featured: z.boolean().default(false),
  popular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  active: z.boolean().default(true),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
  promoOriginalPrice: z.number().positive().nullable().optional(),
  promoDiscount: z.number().int().min(1).max(90).nullable().optional(),
});

const updateSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(80).optional(),
  category: categorySchema.optional(),
  description: z.string().trim().min(3, "Informe a descrição.").max(800).optional(),
  ingredients: z.array(z.string().trim().min(1)).max(20).optional(),
  price: z.number().positive("Preço inválido.").max(9999).optional(),
  image: z.string().trim().min(1, "Informe a imagem.").optional(),
  stock: z.number().int().min(0, "Estoque inválido.").max(100000).optional(),
  featured: z.boolean().optional(),
  popular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  active: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
  promoOriginalPrice: z.number().positive().nullable().optional(),
  promoDiscount: z.number().int().min(1).max(90).nullable().optional(),
});

router.get("/", asyncHandler(async (req, res) => {
  const includeInactive = req.query.includeInactive === "1";
  if (includeInactive && req.authUser?.role !== "ADMIN") {
    throw new HttpError(403, "Você não tem permissão para ver produtos inativos.");
  }

  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

  const products = await prisma.product.findMany({
    where: {
      ...(includeInactive ? {} : { active: true }),
      ...(category ? { category } : {}),
    },
    orderBy: { id: "asc" },
  });

  const filtered = q
    ? products.filter((product) =>
      product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q))
    : products;

  res.json(filtered.map(serializeProduct));
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product || (!product.active && req.authUser?.role !== "ADMIN")) {
    throw new HttpError(404, "Produto não encontrado.");
  }
  res.json(serializeProduct(product));
}));

router.post("/", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const body = parseBody(productSchema, req.body);
  const id = body.id ?? `pb-${Date.now()}`;
  const exists = await prisma.product.findUnique({ where: { id } });
  if (exists) throw new HttpError(409, "Já existe um produto com este código.");

  const product = await prisma.product.create({
    data: {
      id,
      name: body.name,
      category: body.category,
      description: body.description,
      ingredients: JSON.stringify(body.ingredients),
      price: body.price,
      image: body.image,
      stock: body.stock,
      featured: body.featured,
      popular: body.popular,
      isNew: body.isNew,
      active: body.active,
      rating: body.rating,
      reviews: body.reviews,
      promoOriginalPrice: body.promoOriginalPrice ?? null,
      promoDiscount: body.promoDiscount ?? null,
    },
  });
  res.status(201).json(serializeProduct(product));
}));

router.patch("/:id", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const body = parseBody(updateSchema, req.body);
  const current = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!current) throw new HttpError(404, "Produto não encontrado.");

  const product = await prisma.product.update({
    where: { id: current.id },
    data: {
      name: body.name,
      category: body.category,
      description: body.description,
      ingredients: body.ingredients ? JSON.stringify(body.ingredients) : undefined,
      price: body.price,
      image: body.image,
      stock: body.stock,
      featured: body.featured,
      popular: body.popular,
      isNew: body.isNew,
      active: body.active,
      rating: body.rating,
      reviews: body.reviews,
      promoOriginalPrice: body.promoOriginalPrice,
      promoDiscount: body.promoDiscount,
    },
  });
  res.json(serializeProduct(product));
}));

router.delete("/:id", requireRole("ADMIN"), asyncHandler(async (req, res) => {
  const current = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!current) throw new HttpError(404, "Produto não encontrado.");
  await prisma.product.delete({ where: { id: current.id } });
  res.status(204).send();
}));

export default router;
