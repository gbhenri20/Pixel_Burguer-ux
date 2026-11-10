import type { ZodSchema } from "zod";
import { HttpError } from "../lib/errors";

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, result.error.issues[0]?.message ?? "Dados inválidos.");
  }
  return result.data;
}
