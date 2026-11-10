import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: Role;
        email: string;
      };
      sessionId?: string;
    }
  }
}

export {};
