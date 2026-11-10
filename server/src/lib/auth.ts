import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import { HttpError } from "./errors";

export interface AuthToken {
  id: string;
  role: Role;
  email: string;
}

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new HttpError(500, "JWT_SECRET não configurado.");
  return value;
}

export function signToken(payload: AuthToken) {
  return jwt.sign(
    { sub: payload.id, role: payload.role, email: payload.email },
    secret(),
    { expiresIn: "7d" },
  );
}

export function verifyToken(token: string): AuthToken {
  try {
    const decoded = jwt.verify(token, secret());
    if (typeof decoded === "string" || !decoded.sub || !decoded.role || !decoded.email) {
      throw new Error("Token inválido");
    }
    return {
      id: decoded.sub,
      role: decoded.role as Role,
      email: String(decoded.email),
    };
  } catch {
    throw new HttpError(401, "Sessão inválida ou expirada.");
  }
}
