import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/api-response.js';
import { ProfileService } from '../services/profile.service.js';
import { UnauthorizedError } from '../utils/app-error.js';
import type { UpdateProfileBody } from '../validators/profile.validators.js';

export class ProfileController {
  /**
   * GET /api/profile & /api/v1/profile
   * Returns current authenticated user's application profile.
   */
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.authContext) {
        throw new UnauthorizedError('Authentication is required.');
      }

      const profile = await ProfileService.getProfile(req.user.id, req.authContext.token);
      ApiResponse.success(res, profile);
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/profile & /api/v1/profile
   * Updates permitted self-service profile attributes.
   */
  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.authContext) {
        throw new UnauthorizedError('Authentication is required.');
      }

      const updated = await ProfileService.updateProfile(
        req.user.id,
        req.authContext.token,
        req.body as UpdateProfileBody
      );
      ApiResponse.success(res, updated);
    } catch (err) {
      next(err);
    }
  }
}
