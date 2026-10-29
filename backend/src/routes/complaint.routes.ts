import { Router } from 'express';
import { ComplaintController } from '../controllers/complaint.controller.js';
import { requireAuth } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  createComplaintBodySchema,
  updateComplaintStatusBodySchema,
  addCommentBodySchema,
  addEvidenceBodySchema,
  assignComplaintBodySchema,
} from '../validators/complaint.validators.js';

const router = Router();

// Public / Authenticated: Category List
router.get('/categories', ComplaintController.getCategories);

// Citizen: Submit new civic complaint
router.post(
  '/',
  requireAuth,
  validateRequest({ body: createComplaintBodySchema }),
  ComplaintController.create
);

// Citizen: Retrieve own complaints
router.get('/my', requireAuth, ComplaintController.getMyComplaints);

// Staff: Retrieve assigned work orders
router.get('/assigned', requireAuth, ComplaintController.getAssigned);

// Shared: Retrieve complaint details
router.get('/:id', requireAuth, ComplaintController.getById);

// Staff/Admin/Citizen: Update complaint status
router.patch(
  '/:id/status',
  requireAuth,
  validateRequest({ body: updateComplaintStatusBodySchema }),
  ComplaintController.updateStatus
);

// Shared: Add comment or progress note
router.post(
  '/:id/comments',
  requireAuth,
  validateRequest({ body: addCommentBodySchema }),
  ComplaintController.addComment
);

// Staff: Submit resolution evidence proof
router.post(
  '/:id/evidence',
  requireAuth,
  validateRequest({ body: addEvidenceBodySchema }),
  ComplaintController.addEvidence
);

// Admin/Supervisor: Assign complaint to technician
router.post(
  '/:id/assign',
  requireAuth,
  validateRequest({ body: assignComplaintBodySchema }),
  ComplaintController.assign
);

export const complaintRoutes = router;
