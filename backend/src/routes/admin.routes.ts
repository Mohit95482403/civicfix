import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/authenticate.js';
import { requireOrganizationRole } from '../middleware/authorize.js';

const router = Router();

// Ensure all admin routes require authentication and organization admin role
router.use(requireAuth);

router.get('/stats', AdminController.getStats);
router.get('/complaints', AdminController.getComplaints);
router.get('/departments', AdminController.getDepartments);
router.get('/staff', AdminController.getStaff);
router.get('/audit-logs', AdminController.getAuditLogs);

export const adminRoutes = router;
