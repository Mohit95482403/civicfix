# Software Requirements Specification (SRS)
## Project: CivicFix — Civic Problem Reporting & Resolution Tracking Platform
**Document Version:** 1.0.0  
**Phase:** Day 1: Project Planning, Requirements Engineering & System Architecture  
**Status:** Approved Baseline  
**Target Milestone:** 20-Day MVP & Production-Ready Pilot

---

## 1. Project Overview & Executive Summary

**CivicFix** is a startup-grade civic problem reporting and resolution tracking platform designed to bridge the transparency and accountability gap between citizens and municipal maintenance operations. The platform enables citizens to quickly photograph, geo-locate, and report neighborhood infrastructural failures (such as potholes, overflowing garbage dumps, broken streetlights, water pipeline bursts, and damaged public utilities) through a modern cross-platform mobile application.

Municipal field staff and supervisors manage complaints through specialized web portals that streamline triage, assignment, on-site progress tracking, and photographic evidence-based resolution. Administrative teams monitor departmental efficiency, SLA compliance, and civic health metrics through comprehensive analytical dashboards.

### 1.1 Project Identity
* **Project Name:** CivicFix
* **Tagline:** *"Report It. Track It. Improve Your City."*
* **Project Category:** Civic Technology (CivicTech) / Public Infrastructure Maintenance Management
* **Target Environment:** Scalable multi-tenant SaaS architecture initially configured for single-organization pilot municipal wards and housing societies.

### 1.2 Crucial Operating Boundary & Limitation
> **IMPORTANT NOTICE:**  
> Unless an authorized formal government integration, Memorandum of Understanding (MOU), or API agreement is officially established, all complaints filed within CivicFix are managed and resolved strictly within the CivicFix platform ecosystem and its participating organizations/pilot operators. The platform **does not** automatically submit reports to municipal corporation portals (e.g., CPGRAMS, Swachhata app, or local municipal ERPs) without authorized integrations. All public documentation, UI disclaimers, and terms must explicitly preserve this operational truth.

---

## 2. Problem Statement & Market Context

### 2.1 The Existing Municipal Bottleneck
1. **Friction in Reporting:** Citizens encounter complicated grievance portals, unresponsive telephone helplines, or manual paper petitions that discourage participation.
2. **Lack of Transparency & Status Darkness:** Once a complaint is filed, citizens rarely receive verifiable status updates. Reports enter a "black hole," breeding cynicism.
3. **Absence of Photographic Evidence:** Verbal or text-only descriptions lead to ambiguous dispatch, wrong equipment deployment, and false "resolved" claims by contractors.
4. **Disorganized Field Dispatch:** Maintenance departments lack unified digital work-order distribution, resulting in unbalanced workloads, delayed SLA responses, and duplicate work orders for the same incident.
5. **No Independent Audit Trail:** Traditional systems lack immutable audit logging for status transitions, leaving supervisors unable to track accountability when complaints stall.

### 2.2 The CivicFix Solution
CivicFix introduces a closed-loop resolution system:
* **Citizen Mobile App (Flutter):** Sub-60-second complaint submission with mandatory camera capture, precise GPS coordinates, automated duplicate warnings, and push notifications at every lifecycle transition.
* **Staff Field Portal (React + Vite):** Mobile-responsive web portal for field technicians to view assigned tickets, navigate to sites, post internal notes, and submit mandatory post-repair evidence photos.
* **Supervisor & Admin Portal (React + Vite):** Departmental routing, workload balancing, SLA breach alerts, category management, and audit logs.
* **Central API & Data Tier (Node.js/Express + Supabase PostgreSQL):** Robust business rules, role-based access control (RBAC), multi-tenant isolation, and Row Level Security (RLS).

---

## 3. Project Objectives

1. **Streamlined Reporting:** Enable citizens to report civic grievances in under 60 seconds with photos, category, and automatic geolocation.
2. **Accountability Through Evidence:** Enforce mandatory photographic proof of resolution before any ticket can enter the `RESOLVED` status.
3. **Transparent Lifecycle Tracking:** Deliver verifiable status updates (`SUBMITTED` → `UNDER_REVIEW` → `VERIFIED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`) with immutable timestamped history.
4. **Citizen Feedback Loop:** Empower citizens to rate resolution quality or request reopening within a 48-hour window if work is substandard.
5. **Architectural Security & Isolation:** Ensure complete data isolation between pilot organizations, zero credential leakage, and strict server-side authorization.
6. **20-Day MVP Feasibility:** Establish an achievable, robust, bug-free codebase ready for presentation, MCA evaluation, and initial pilot deployment.

---

## 4. User Personas & Target Audiences

| Persona | Role | Primary Goals | Key Pain Points |
| :--- | :--- | :--- | :--- |
| **Priya Sharma** (28) | Citizen / Commuter | Report broken streetlights and potholes near her home; track resolution on mobile. | Frustrated by broken portals; wants quick photographic proof that action was taken. |
| **Ramesh Kumar** (42) | Field Technician / Staff | Receive clear task assignments with exact locations and photo references; submit repair proofs. | Overwhelmed by disorganized phone calls; accused of non-performance without evidence. |
| **Sunita Patil** (49) | Department Supervisor | Triage departmental issues (Water/Roads); assign work to technicians; monitor overdue tickets. | Lacks visibility into team workloads and SLA breaches; manual Excel-based tracking. |
| **Anand Verma** (52) | Organization Admin | Configure departments, onboard staff, manage categories, analyze ward-level complaint trends. | Needs aggregate analytics and audit trails to report progress to municipal leadership. |
| **System Operator** (35) | Platform Admin | Maintain platform health, onboard new pilot organizations, oversee system configuration. | Requires multi-tenant isolation, data integrity, and strict access controls. |

---

## 5. Functional Requirements (Categorized by Module & Priority)

Requirements are classified according to the MoSCoW prioritization model:
* **Must Have (MH):** Essential for the 20-Day MVP. Without these, the platform cannot function.
* **Should Have (SH):** Highly valuable features planned for the second half of the 20-day build if time permits, or immediate fast-follows.
* **Future Enhancement (FE):** Planned for post-pilot commercial release (out of initial 20-day scope).

---

### Module A: Citizen Mobile Application (Flutter)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-CIT-01** | User registration and email/password login using Supabase Auth integration. | **Must Have** |
| **FR-CIT-02** | Citizen Profile Management (name, phone number, optional avatar). | **Must Have** |
| **FR-CIT-03** | Dashboard displaying active tickets, recent submissions, and resolution statuses. | **Must Have** |
| **FR-CIT-04** | Complaint creation wizard: Title, detailed description, category selection. | **Must Have** |
| **FR-CIT-05** | Image attachment via device camera or gallery (JPEG/PNG, max 5MB, up to 3 photos). | **Must Have** |
| **FR-CIT-06** | Geolocation capture: Automatic device GPS coordinates with map preview and address reverse-geocoding. | **Must Have** |
| **FR-CIT-07** | Unique Tracking Reference generation (e.g., `CF-2026-BLR-001042`). | **Must Have** |
| **FR-CIT-08** | Complaint Tracking Timeline: Step-by-step visual tracker of complaint lifecycle with status notes. | **Must Have** |
| **FR-CIT-09** | Public comment section: Citizen can post inquiries or clarifications on their complaints. | **Must Have** |
| **FR-CIT-10** | Citizen feedback & rating (1 to 5 stars + optional review) upon issue resolution. | **Must Have** |
| **FR-CIT-11** | Reopening request: Citizen can request reopening within 48 hours of resolution if issue persists. | **Must Have** |
| **FR-CIT-12** | Nearby complaint discovery map/list: View existing public complaints within a 1km to 5km radius to prevent duplicate reports. | **Should Have** |
| **FR-CIT-13** | Push notifications via Firebase Cloud Messaging (FCM) for status transitions. | **Should Have** |
| **FR-CIT-14** | Offline submission queue with background sync upon reconnecting. | **Future Enhancement** |
| **FR-CIT-15** | Social media sharing of resolved civic improvements. | **Future Enhancement** |

---

### Module B: Staff Field Web Portal (React + Vite + Tailwind CSS)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-STF-01** | Secure authentication for provisioned staff members (No public self-registration). | **Must Have** |
| **FR-STF-02** | Assigned Workload Dashboard: View tickets filtered by `ASSIGNED`, `IN_PROGRESS`, and `RESOLVED`. | **Must Have** |
| **FR-STF-03** | Complaint Detail View: Citizen photos, GPS map coordinates, description, timeline. | **Must Have** |
| **FR-STF-04** | Status Transition Actions: Authorized transition from `ASSIGNED` → `IN_PROGRESS`. | **Must Have** |
| **FR-STF-05** | Resolution Submission: Mandatory post-repair photograph upload + closing remarks before marking `RESOLVED`. | **Must Have** |
| **FR-STF-06** | Internal Progress Notes: Staff can post internal operational notes visible only to departmental personnel. | **Must Have** |
| **FR-STF-07** | Search and multi-criteria filtering (by category, priority, date range, reference code). | **Must Have** |
| **FR-STF-08** | Overdue and SLA-breach visual indicators on ticket cards. | **Should Have** |
| **FR-STF-09** | Turn-by-turn map navigation link launching external mapping provider (Google Maps/OSM). | **Should Have** |
| **FR-STF-10** | Native Android/iOS field staff application (replacing web portal). | **Future Enhancement** |

---

### Module C: Supervisor & Admin Web Portal (React + Vite + Tailwind CSS)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-ADM-01** | Dual-tier role authentication: Department Supervisor vs. Organization Administrator vs. Platform Administrator. | **Must Have** |
| **FR-ADM-02** | Departmental Complaint Triage: Review incoming `SUBMITTED` tickets; accept to `VERIFIED` or mark `REJECTED` with mandatory justification. | **Must Have** |
| **FR-ADM-03** | Work Order Assignment: Assign `VERIFIED` complaints to specific field staff within the authorized department. | **Must Have** |
| **FR-ADM-04** | Workload Reassignment: Reassign tickets between staff members with logged reasons. | **Must Have** |
| **FR-ADM-05** | Department Management: Create, edit, and assign categories to municipal departments (e.g., Sanitation, Roads, Electrical). | **Must Have** |
| **FR-ADM-06** | Category Management: Manage dynamic problem categories, priority levels, and default SLA hours without code deployment. | **Must Have** |
| **FR-ADM-07** | Staff Account Provisioning: Org Admins provision staff credentials and link them to designated departments. | **Must Have** |
| **FR-ADM-08** | Review Reopen Requests: Supervisors evaluate citizen reopening requests and decide to re-assign or finalize `CLOSED`. | **Must Have** |
| **FR-ADM-09** | Duplicate Complaint Handling: Flag complaints as `DUPLICATE`, linking child complaint to master reference. | **Must Have** |
| **FR-ADM-10** | Dashboard Analytics: Total volume, resolution rate, average turnaround time, category breakdown charts. | **Should Have** |
| **FR-ADM-11** | Audit Trail Viewer: Inspect immutable event logs for every status change, assignment, and administrative edit. | **Should Have** |
| **FR-ADM-12** | CSV/PDF export of complaint reports for departmental review meetings. | **Should Have** |
| **FR-ADM-13** | Multi-organization onboarding self-service wizard (Platform Admin). | **Future Enhancement** |
| **FR-ADM-14** | Automated AI-based image classification and priority auto-tagging. | **Future Enhancement** |

---

### Module D: Shared Backend Platform & Infrastructure (Node.js/Express + Supabase)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-PLT-01** | Centralized REST API engine running on Node.js / Express with modular router architecture. | **Must Have** |
| **FR-PLT-02** | Supabase Auth JWT validation middleware extracting user ID, role, and organization ID. | **Must Have** |
| **FR-PLT-03** | Server-side Role-Based Access Control (RBAC) middleware verifying fine-grained permissions. | **Must Have** |
| **FR-PLT-04** | Strict Organization-level multi-tenant data isolation on all database queries. | **Must Have** |
| **FR-PLT-05** | Supabase Storage integration with private resolution buckets and public/signed complaint media buckets. | **Must Have** |
| **FR-PLT-06** | Comprehensive request payload validation using schema validators (e.g., Zod) on all mutation endpoints. | **Must Have** |
| **FR-PLT-07** | Immutable status history logger triggered on every state transition. | **Must Have** |
| **FR-PLT-08** | Separation of internal staff notes from public comments at both API and DB query levels. | **Must Have** |
| **FR-PLT-09** | API rate-limiting and slow-down protection on authentication and upload endpoints. | **Must Have** |
| **FR-PLT-10** | Standardized JSON error response envelope preventing stack trace disclosure. | **Must Have** |
| **FR-PLT-11** | Geospatial radius query engine for nearby complaint discovery. | **Should Have** |
| **FR-PLT-12** | Push notification dispatcher integrating Firebase Cloud Messaging (FCM). | **Should Have** |
| **FR-PLT-13** | Database-level PostgreSQL Row Level Security (RLS) policies reinforcing multi-tenant boundaries. | **Must Have** |
| **FR-PLT-14** | Automated database backup and disaster recovery schedules. | **Should Have** |

---

## 6. Core Problem Categories (Initial Seed & Dynamic Architecture)

The system is seeded with 6 primary civic categories. Each category belongs to a designated municipal department and carries an initial default SLA target:

| # | Category Name | Default Department | Default Priority | Default SLA Target |
| :-: | :--- | :--- | :--- | :-: |
| 1 | **Potholes and Damaged Roads** | Roads & Infrastructure | High | 48 Hours |
| 2 | **Garbage Overflow & Waste Dumps** | Solid Waste Management | Urgent | 24 Hours |
| 3 | **Broken Streetlights & Electrical Hazards** | Electrical & Street Lighting | High | 24 Hours |
| 4 | **Water Pipeline Leakage** | Water Supply & Sewerage | Urgent | 12 Hours |
| 5 | **Drainage & Sewage Overflow** | Water Supply & Sewerage | Urgent | 24 Hours |
| 6 | **Damaged Public Infrastructure & Parks** | Public Works Department (PWD) | Medium | 72 Hours |

### Extensibility Rule:
Categories are stored in the database table `complaint_categories` scoped by organization. Authorized Organization Administrators can add, rename, deactivate, or alter SLA targets via the Admin Portal without touching code or redeploying backend services.

---

## 7. Complaint Lifecycle & State Machine

A complaint in CivicFix must transition through an explicit, strictly governed set of 10 statuses.

```
       [Citizen Submits]
              │
              ▼
        [SUBMITTED] ───────────► [REJECTED] (Supervisor/Admin with reason)
              │
              ├───────────────► [DUPLICATE] (Linked to Parent Ticket)
              ▼
        [UNDER_REVIEW]
              │
              ▼
         [VERIFIED]
              │
              ▼
         [ASSIGNED] (Assigned to Department & Staff)
              │
              ▼
        [IN_PROGRESS] (Staff starts work)
              │
              ▼
         [RESOLVED] (Staff submits photographic proof)
              │
       ┌──────┴──────────────────────────┐
       │ (Citizen reopens within 48h)    │ (Citizen rates or Auto-closed)
       ▼                                 ▼
   [REOPENED]                         [CLOSED]
       │
       └─► Re-enters [VERIFIED] / [ASSIGNED]
```

### 7.1 Status Definitions & Allowed Transitions

| Status | Definition | Allowed Next Statuses | Authorized Actors | Conditions / Proof Required |
| :--- | :--- | :--- | :--- | :--- |
| **SUBMITTED** | Initial state created upon citizen submission. | `UNDER_REVIEW`, `REJECTED`, `DUPLICATE` | System (automatic), Supervisor, Org Admin | Unique tracking reference generated. |
| **UNDER_REVIEW** | Under evaluation by departmental supervisor. | `VERIFIED`, `REJECTED`, `DUPLICATE` | Supervisor, Org Admin | Initial assessment of validity. |
| **VERIFIED** | Complaint confirmed as authentic civic issue. | `ASSIGNED`, `REJECTED` | Supervisor, Org Admin | Category and department confirmed. |
| **ASSIGNED** | Ticket allocated to specific field technician. | `IN_PROGRESS`, `ASSIGNED` (reassign) | Supervisor, Org Admin | Staff ID and estimated completion set. |
| **IN_PROGRESS** | Staff member has arrived on site / initiated work. | `RESOLVED` | Assigned Staff, Supervisor | Status note or site check-in. |
| **RESOLVED** | Remediation completed. | `CLOSED`, `REOPENED` | Assigned Staff, Supervisor | **MANDATORY:** Minimum 1 resolution photo + summary. |
| **CLOSED** | Finalized complaint; resolution accepted. | None (Terminal) | Citizen (via feedback), Supervisor, System (48h auto-close) | Citizen ratings captured or timeout expired. |
| **REOPENED** | Citizen disputes resolution within 48h window. | `UNDER_REVIEW`, `ASSIGNED` | Citizen, Supervisor | **MANDATORY:** Reopening rationale description. |
| **REJECTED** | Invalid, spam, out-of-jurisdiction, or unverifiable. | None (Terminal) | Supervisor, Org Admin | **MANDATORY:** Written justification sent to citizen. |
| **DUPLICATE** | Identical incident already logged nearby. | None (Terminal) | Supervisor, Org Admin | **MANDATORY:** Reference to primary Master Complaint ID. |

### 7.2 Duplicate Handling Policy
CivicFix does not reject reports silently or automatically block submissions. Instead:
1. When a citizen selects a location, the app queries for existing open complaints within a 200-meter radius in the same category.
2. The citizen is shown a non-blocking prompt: *"A similar issue was reported nearby. Is this the same problem?"*
3. If the citizen proceeds anyway, the supervisor can review side-by-side photos and manually merge the ticket into `DUPLICATE` status, linking it to the parent complaint so the citizen still receives resolution notifications.

---

## 8. Non-Functional Requirements (NFRs)

### 8.1 Performance
* **API Latency:** 95% of standard read requests must respond within < 200ms; write operations (excluding large file uploads) within < 400ms.
* **Image Upload Pipeline:** Images must be compressed client-side before transmission, ensuring mobile uploads complete in < 3 seconds on standard 4G networks.
* **Geospatial Discovery:** Nearby complaints query (within 2km radius) must return results in < 250ms for datasets up to 50,000 active tickets.

### 8.2 Security & Data Protection
* **Zero Secret Exposure:** No database credentials or Supabase `service_role` keys shall ever be packaged in mobile APK/IPA builds or web frontend bundles.
* **Role Enforcement:** All authorization checks must occur server-side; client UI role gating is purely for UX convenience.
* **Network Transport Security:** All traffic must enforce TLS 1.3 in transit; sensitive stored assets must use encrypted storage buckets.
* **Data Privacy:** Citizen contact details (phone numbers and full email addresses) must be masked from field staff to prevent harassment. Field staff only see complaint description, location, and photos.

### 8.3 Reliability & Availability
* **Service Availability:** Target 99.5% uptime during pilot phases.
* **Data Durability:** Automated daily database snapshots via Supabase managed backups.
* **Audit Integrity:** All status transitions and assignment modifications must be written to append-only history tables.

### 8.4 Usability & Accessibility
* **Mobile Responsiveness:** Web portals must render cleanly on desktop, tablet, and mobile screens (responsive viewport break-points).
* **Low-Literacy Friendliness:** Mobile complaint wizard must incorporate recognizable category icons, minimal text requirements, and visual status cards.

---

## 9. MVP Scope vs. Out-of-Scope Boundary

### 9.1 In-Scope (20-Day MVP Delivery)
* Full citizen mobile app lifecycle: Registration, photo capture, GPS tagging, tracking, feedback, reopening.
* Staff web portal: Assigned queue, detail view, progress notes, photographic evidence upload, status transitions.
* Admin web portal: Triage, assignment, reassignment, department management, category management, staff provisioning, basic metrics.
* Central Node/Express API with JWT validation, RBAC, multi-tenant isolation, file upload pipeline, and audit logging.
* Complete database schema across 14 tables in Supabase PostgreSQL with RLS foundations.

### 9.2 Explicitly Out-of-Scope for Initial 20-Day Build
* Direct automated integration with government ERPs or municipal corporate databases (e.g., CPGRAMS, Smart City command centers).
* Native iOS/Android field staff apps (Staff will use the responsive mobile-friendly Web Portal).
* Payment gateway integrations (CivicFix is non-transactional for civic reporting).
* Autonomous AI-based automated ticket resolution without human verification.
* Multi-lingual voice-to-text complaint dictation.
* Municipal tax or utility billing integrations.

---

## 10. Acceptance Criteria for Day 1

1. Comprehensive SRS document established detailing all functional and non-functional specifications.
2. Five distinct user roles and permissions defined without self-escalation risks.
3. 10-stage complaint lifecycle formalized with transition rules and proof requirements.
4. Core 6 problem categories established with dynamic configuration rules.
5. MoSCoW prioritization applied across all four functional modules.
6. Clear boundaries set separating the 20-day MVP from future post-pilot capabilities.
7. Architecture, database, API, user roles, and security blueprints aligned with the fixed technology stack.
