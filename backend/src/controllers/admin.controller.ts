import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaint.service.js';
import { ApiResponse } from '../utils/api-response.js';

export class AdminController {
  public static async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orgId = (req.query.organizationId as string) || '';
      const stats = await ComplaintService.getAdminStats(orgId);
      ApiResponse.success(res, stats);
    } catch (err) {
      next(err);
    }
  }

  public static async getComplaints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orgId = (req.query.organizationId as string) || '';
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const complaints = await ComplaintService.getAdminComplaints(orgId, {
        status,
        search,
      });
      ApiResponse.success(res, complaints);
    } catch (err) {
      next(err);
    }
  }

  public static async getDepartments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orgId = (req.query.organizationId as string) || '';
      const departments = await ComplaintService.getAdminDepartments(orgId);
      ApiResponse.success(res, departments);
    } catch (err) {
      next(err);
    }
  }

  public static async getStaff(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orgId = (req.query.organizationId as string) || '';
      const staff = await ComplaintService.getAdminStaff(orgId);
      ApiResponse.success(res, staff);
    } catch (err) {
      next(err);
    }
  }

  public static async getAuditLogs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const logs = [
        {
          id: 'log-101',
          action: 'STAFF_PROVISIONED',
          actor: req.user!.email,
          target: 'Sunil Kumar (STAFF)',
          ipAddress: req.ip || '127.0.0.1',
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
        },
        {
          id: 'log-102',
          action: 'STATUS_TRANSITION',
          actor: req.user!.email,
          target: 'CF-2026-BLR-001001 -> IN_PROGRESS',
          ipAddress: req.ip || '127.0.0.1',
          timestamp: new Date().toISOString(),
          status: 'SUCCESS',
        },
      ];
      ApiResponse.success(res, logs);
    } catch (err) {
      next(err);
    }
  }
}
