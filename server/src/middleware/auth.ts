import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { HttpError } from "../lib/errors";
import { verifyToken } from "../lib/auth";

export function attachIdentity(req: Request, _res: Response, next: NextFunction) {
  const session = req.header("x-session-id");
  if (session && /^[a-zA-Z0-9-]{8,80}$/.test(session)) {
    req.sessionId = session;
  }

  const header = req.header("authorization");
  if (header?.startsWith("Bearer ")) {
    try {
      req.authUser = verifyToken(header.slice(7).trim());
    } catch {
      req.authUser = undefined;
    }
  }

  next();
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.authUser) {
    next(new HttpError(401, "Faça login para continuar."));
    return;
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      next(new HttpError(401, "Faça login para continuar."));
      return;
    }
    if (!roles.includes(req.authUser.role)) {
      next(new HttpError(403, "Você não tem permissão para esta ação."));
      return;
    }
    next();
  };
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
