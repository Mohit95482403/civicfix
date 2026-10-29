import { z } from 'zod';

export const createComplaintBodySchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters.')
    .max(200, 'Title cannot exceed 200 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(3000, 'Description cannot exceed 3000 characters.'),
  categoryId: z.string().uuid('Valid category UUID is required.'),
  organizationId: z.string().uuid().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  addressText: z.string().max(300).optional(),
  locationDescription: z.string().max(500).optional(),
});

export const updateComplaintStatusBodySchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'UNDER_REVIEW',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED',
    'REJECTED',
  ]),
  reason: z.string().max(500).optional(),
});

export const addCommentBodySchema = z.object({
  body: z
    .string()
    .min(1, 'Comment body cannot be empty.')
    .max(2000, 'Comment cannot exceed 2000 characters.'),
  visibility: z
    .enum(['CITIZEN_VISIBLE', 'INTERNAL_STAFF_ONLY'])
    .default('CITIZEN_VISIBLE'),
});

export const addEvidenceBodySchema = z.object({
  description: z
    .string()
    .min(5, 'Evidence description must be at least 5 characters.')
    .max(1000),
  attachmentId: z.string().uuid().optional(),
});

export const assignComplaintBodySchema = z.object({
  departmentId: z.string().uuid('Department UUID is required.'),
  assignedTo: z.string().uuid('Technician UUID is required.'),
  notes: z.string().max(500).optional(),
});

export type CreateComplaintBody = z.infer<typeof createComplaintBodySchema>;
export type UpdateComplaintStatusBody = z.infer<typeof updateComplaintStatusBodySchema>;
export type AddCommentBody = z.infer<typeof addCommentBodySchema>;
export type AddEvidenceBody = z.infer<typeof addEvidenceBodySchema>;
export type AssignComplaintBody = z.infer<typeof assignComplaintBodySchema>;
