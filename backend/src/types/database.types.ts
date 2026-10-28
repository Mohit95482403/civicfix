/**
 * CivicFix Supabase PostgreSQL TypeScript Definitions
 * Phase: Day 4 Database Architecture
 *
 * This file provides TypeScript typings for all 14 core entities, domain ENUMs,
 * and database helper procedure contracts implemented in database/migrations/.
 *
 * To regenerate automatically from a live Supabase project:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED'
  | 'REJECTED'
  | 'DUPLICATE';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type StaffRole = 'STAFF' | 'SUPERVISOR' | 'ORG_ADMIN';

export type AttachmentType = 'COMPLAINT_PHOTO' | 'RESOLUTION_PROOF' | 'OTHER';

export type CommentVisibility = 'CITIZEN_VISIBLE' | 'INTERNAL_ONLY';

export type NotificationType =
  | 'STATUS_UPDATE'
  | 'ASSIGNMENT'
  | 'COMMENT'
  | 'SLA_WARNING'
  | 'SYSTEM';

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          code: string;
          description: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          code: string;
          description?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          code?: string;
          description?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone_number: string | null;
          avatar_path: string | null;
          preferred_language: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone_number?: string | null;
          avatar_path?: string | null;
          preferred_language?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone_number?: string | null;
          avatar_path?: string | null;
          preferred_language?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          slug: string;
          code: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          slug: string;
          code: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          slug?: string;
          code?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff_memberships: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          department_id: string | null;
          role: StaffRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          department_id?: string | null;
          role?: StaffRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string;
          department_id?: string | null;
          role?: StaffRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      platform_administrators: {
        Row: {
          user_id: string;
          granted_by: string | null;
          granted_at: string;
          notes: string | null;
        };
        Insert: {
          user_id: string;
          granted_by?: string | null;
          granted_at?: string;
          notes?: string | null;
        };
        Update: {
          user_id?: string;
          granted_by?: string | null;
          granted_at?: string;
          notes?: string | null;
        };
      };
      complaint_categories: {
        Row: {
          id: string;
          organization_id: string | null;
          department_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          icon_key: string;
          sla_hours: number;
          priority: ComplaintPriority;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id?: string | null;
          department_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          icon_key?: string;
          sla_hours?: number;
          priority?: ComplaintPriority;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string | null;
          department_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_key?: string;
          sla_hours?: number;
          priority?: ComplaintPriority;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      complaints: {
        Row: {
          id: string;
          reference_number: string;
          organization_id: string;
          citizen_id: string;
          category_id: string;
          title: string;
          description: string;
          status: ComplaintStatus;
          priority: ComplaintPriority;
          latitude: number | null;
          longitude: number | null;
          address_text: string | null;
          location_description: string | null;
          submitted_at: string;
          sla_due_at: string | null;
          resolved_at: string | null;
          closed_at: string | null;
          reopened_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_number?: string;
          organization_id: string;
          citizen_id: string;
          category_id: string;
          title: string;
          description: string;
          status?: ComplaintStatus;
          priority?: ComplaintPriority;
          latitude?: number | null;
          longitude?: number | null;
          address_text?: string | null;
          location_description?: string | null;
          submitted_at?: string;
          sla_due_at?: string | null;
          resolved_at?: string | null;
          closed_at?: string | null;
          reopened_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_number?: string;
          organization_id?: string;
          citizen_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          status?: ComplaintStatus;
          priority?: ComplaintPriority;
          latitude?: number | null;
          longitude?: number | null;
          address_text?: string | null;
          location_description?: string | null;
          submitted_at?: string;
          sla_due_at?: string | null;
          resolved_at?: string | null;
          closed_at?: string | null;
          reopened_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      complaint_attachments: {
        Row: {
          id: string;
          complaint_id: string;
          uploaded_by: string;
          storage_path: string;
          original_filename: string | null;
          mime_type: string;
          file_size_bytes: number;
          attachment_type: AttachmentType;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          uploaded_by: string;
          storage_path: string;
          original_filename?: string | null;
          mime_type: string;
          file_size_bytes: number;
          attachment_type?: AttachmentType;
          created_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          uploaded_by?: string;
          storage_path?: string;
          original_filename?: string | null;
          mime_type?: string;
          file_size_bytes?: number;
          attachment_type?: AttachmentType;
          created_at?: string;
        };
      };
      complaint_assignments: {
        Row: {
          id: string;
          complaint_id: string;
          organization_id: string;
          department_id: string;
          assigned_to: string;
          assigned_by: string;
          assigned_at: string;
          unassigned_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          organization_id: string;
          department_id: string;
          assigned_to: string;
          assigned_by: string;
          assigned_at?: string;
          unassigned_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          organization_id?: string;
          department_id?: string;
          assigned_to?: string;
          assigned_by?: string;
          assigned_at?: string;
          unassigned_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      complaint_status_history: {
        Row: {
          id: string;
          complaint_id: string;
          previous_status: ComplaintStatus | null;
          new_status: ComplaintStatus;
          changed_by: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          previous_status?: ComplaintStatus | null;
          new_status: ComplaintStatus;
          changed_by: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: never; // Immutable: no updates permitted
      };
      complaint_comments: {
        Row: {
          id: string;
          complaint_id: string;
          author_id: string;
          body: string;
          visibility: CommentVisibility;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          author_id: string;
          body: string;
          visibility?: CommentVisibility;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          author_id?: string;
          body?: string;
          visibility?: CommentVisibility;
          created_at?: string;
          updated_at?: string;
        };
      };
      resolution_evidence: {
        Row: {
          id: string;
          complaint_id: string;
          submitted_by: string;
          description: string;
          attachment_id: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          submitted_by: string;
          description: string;
          attachment_id?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          submitted_by?: string;
          description?: string;
          attachment_id?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      complaint_feedback: {
        Row: {
          id: string;
          complaint_id: string;
          citizen_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          complaint_id: string;
          citizen_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          complaint_id?: string;
          citizen_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          recipient_id: string;
          complaint_id: string | null;
          type: NotificationType;
          title: string;
          body: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_id: string;
          complaint_id?: string | null;
          type?: NotificationType;
          title: string;
          body: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_id?: string;
          complaint_id?: string | null;
          type?: NotificationType;
          title?: string;
          body?: string;
          read_at?: string | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          organization_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          organization_id?: string | null;
          action: string;
          entity_type: string;
          entity_id: string;
          metadata?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: never; // Immutable audit trail
      };
    };
    Functions: {
      is_org_member: {
        Args: { p_org_id: string; p_user_id: string };
        Returns: boolean;
      };
      has_org_role: {
        Args: {
          p_org_id: string;
          p_user_id: string;
          p_required_role: StaffRole;
        };
        Returns: boolean;
      };
      is_platform_admin: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
      record_status_transition: {
        Args: {
          p_complaint_id: string;
          p_new_status: ComplaintStatus;
          p_changed_by: string;
          p_reason?: string | null;
        };
        Returns: void;
      };
    };
  };
}
