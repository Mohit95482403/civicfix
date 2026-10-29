import { Request, Response, NextFunction } from 'express';
import { ComplaintService } from '../services/complaint.service.js';
import { AuthService } from '../services/auth.service.js';
import { AuthorizationService } from '../services/authorization.service.js';
import { ApiResponse } from '../utils/api-response.js';

export class ComplaintController {
  private static async getUserContext(req: Request) {
    if (!req.authContext?.memberships || req.authContext.memberships.length === 0) {
      const [memberships, isPlatformAdmin] = await Promise.all([
        AuthorizationService.getUserMemberships(req.user!.id, req.authContext!.token),
        AuthorizationService.isPlatformAdmin(req.user!.id, req.authContext!.token),
      ]);
      req.authContext!.memberships = memberships;
      req.authContext!.isPlatformAdmin = isPlatformAdmin;
    }

    const role = AuthService.computePrimaryRole(
      req.authContext!.isPlatformAdmin,
      req.authContext!.memberships
    );

    return {
      userId: req.user!.id,
      role,
      memberships: req.authContext!.memberships,
    };
  }

  public static async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categories = await ComplaintService.getCategories();
      ApiResponse.success(res, categories);
    } catch (err) {
      next(err);
    }
  }

  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const citizenId = req.user!.id;
      const token = req.authContext!.token;
      const complaint = await ComplaintService.createComplaint(
        citizenId,
        req.body,
        token
      );
      ApiResponse.created(res, complaint);
    } catch (err) {
      next(err);
    }
  }

  public static async getMyComplaints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const citizenId = req.user!.id;
      const token = req.authContext!.token;
      const complaints = await ComplaintService.getMyComplaints(citizenId, token);
      ApiResponse.success(res, complaints);
    } catch (err) {
      next(err);
    }
  }

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const complaintId = req.params.id;
      const userContext = await ComplaintController.getUserContext(req);
      const token = req.authContext!.token;
      const data = await ComplaintService.getComplaintById(
        complaintId,
        userContext,
        token
      );
      ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async getAssigned(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const staffId = req.user!.id;
      const userContext = await ComplaintController.getUserContext(req);
      const complaints = await ComplaintService.getAssignedComplaints(
        staffId,
        userContext
      );
      ApiResponse.success(res, complaints);
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const complaintId = req.params.id;
      const actorId = req.user!.id;
      const userContext = await ComplaintController.getUserContext(req);
      const updated = await ComplaintService.updateComplaintStatus(
        complaintId,
        actorId,
        req.body,
        userContext
      );
      ApiResponse.success(res, updated);
    } catch (err) {
      next(err);
    }
  }

  public static async addComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const complaintId = req.params.id;
      const authorId = req.user!.id;
      const userContext = await ComplaintController.getUserContext(req);
      const comment = await ComplaintService.addComment(
        complaintId,
        authorId,
        req.body,
        userContext
      );
      ApiResponse.created(res, comment);
    } catch (err) {
      next(err);
    }
  }

  public static async addEvidence(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const complaintId = req.params.id;
      const submittedBy = req.user!.id;
      const userContext = await ComplaintController.getUserContext(req);
      const evidence = await ComplaintService.addEvidence(
        complaintId,
        submittedBy,
        req.body,
        userContext
      );
      ApiResponse.created(res, evidence);
    } catch (err) {
      next(err);
    }
  }

  public static async assign(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const complaintId = req.params.id;
      const assignedBy = req.user!.id;
      const userContext = await ComplaintController.getUserContext(req);
      const assignment = await ComplaintService.assignComplaint(
        complaintId,
        assignedBy,
        req.body,
        userContext
      );
      ApiResponse.created(res, assignment);
    } catch (err) {
      next(err);
    }
  }
}
