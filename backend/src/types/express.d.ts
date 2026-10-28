import type { AuthenticatedUser, AuthContext } from './auth.types.js';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: AuthenticatedUser;
      authContext?: AuthContext;
    }
  }
}

export {};
