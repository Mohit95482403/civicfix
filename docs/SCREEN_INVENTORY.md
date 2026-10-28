# CivicFix Screen Inventory
**Phase:** Day 2: UI/UX Design

---

## 1. Citizen Mobile Application (Flutter)

| # | Screen ID | Screen Name | Purpose | Primary Actions | Key Components | Data Requirements | States |
|:-:|:---|:---|:---|:---|:---|:---|:---|
| 1 | `CIT-SPL` | Splash Screen | Brand loading | Auto-navigate | Logo, tagline, loading indicator | None | Loading → Navigate |
| 2 | `CIT-ONB` | Onboarding (3 slides) | First-launch introduction | Skip, Next, Get Started | Illustration, headline, description, dots | First-launch flag | Default, Last slide |
| 3 | `CIT-REG` | Registration | Create citizen account | Register, Go to Login | Name, email, password fields, terms checkbox | None | Default, Validating, Error, Loading, Success |
| 4 | `CIT-LOG` | Login | Authenticate citizen | Sign In, Forgot Password, Go to Register | Email, password fields, show/hide toggle | None | Default, Validating, Error, Loading, Success |
| 5 | `CIT-HOM` | Home Dashboard | Central hub & quick actions | Report Issue, View Complaints | Greeting, stats summary cards, active tickets, nearby issues | Profile, complaint stats, recent complaints | Default, Loading, Empty (new user), Error |
| 6 | `CIT-CAT` | Category Selection | Step 1: Pick issue type | Select Category, Back | Category cards with icons | Categories list | Default, Loading, Error |
| 7 | `CIT-DET` | Problem Details | Step 2: Describe issue | Next, Back | Title input, description textarea, char count | None | Default, Validation Error |
| 8 | `CIT-PHO` | Photo Upload | Step 3: Add evidence | Take Photo, Choose Gallery, Remove, Next | Camera button, gallery button, image previews | Device camera/gallery | Default, Uploading, Error, No Permission |
| 9 | `CIT-LOC` | Location Select | Step 4: Pin location | Use Current, Search, Confirm | Map view, search bar, pin marker, address display | GPS, map tiles | Default, Loading, Permission Denied, Manual Entry |
| 10 | `CIT-REV` | Review & Submit | Step 5: Confirm details | Submit, Edit sections | Summary of all fields, edit links per section | Aggregated form data | Default, Submitting, Error |
| 11 | `CIT-CNF` | Submission Confirmation | Show success & reference | View Complaint, Go Home | Success icon, tracking reference, summary | Created complaint | Success |
| 12 | `CIT-LST` | Complaint List | Browse own complaints | Search, Filter, Tap to Detail | Search bar, filter chips, complaint cards | User's complaints | Default, Loading, Empty, No Results, Error |
| 13 | `CIT-DTL` | Complaint Detail | Track specific complaint | Comment, Give Feedback, Reopen | Status timeline, photos, map, comments, resolution | Single complaint full data | Default, Loading, Error |
| 14 | `CIT-MAP` | Nearby Issues Map | Discover nearby problems | Toggle List/Map, Filter, Tap Pin | Map view, complaint markers, filter bar | Nearby complaints, location | Default, Loading, Empty, Permission Denied, Error |
| 15 | `CIT-NTF` | Notifications | View all alerts | Tap notification, Mark read | Notification cards, read/unread styling | User notifications | Default, Loading, Empty, Error |
| 16 | `CIT-PRF` | Profile & Settings | Manage account | Edit Profile, Sign Out | Avatar, name, email, preferences, help links | User profile | Default, Editing, Saving |
| 17 | `CIT-FBK` | Feedback & Rating | Rate resolution | Submit Rating, Reopen | Star rating, comment input, submit/reopen buttons | Resolved complaint | Default, Submitting, Success |
| 18 | `CIT-ROP` | Reopen Request | Dispute resolution | Submit Reopen | Reason textarea, confirmation dialog | Resolved complaint | Default, Confirming, Submitting, Success |

---

## 2. Staff Web Portal (React + Vite)

| # | Screen ID | Screen Name | Purpose | Primary Actions | Key Components | Data Requirements | States |
|:-:|:---|:---|:---|:---|:---|:---|:---|
| 1 | `STF-LOG` | Staff Login | Authenticate staff | Sign In | Email, password, branding | None | Default, Error, Loading |
| 2 | `STF-DSH` | Staff Dashboard | Overview of assigned work | View Complaint, Navigate Queue | Stats cards, recent activity, quick links | Staff stats, recent complaints | Default, Loading, Empty, Error |
| 3 | `STF-QUE` | Complaint Queue | Browse assigned tickets | Search, Filter, Sort, View Detail | Table/list, search bar, filters, pagination | Assigned complaints | Default, Loading, Empty, No Results, Error |
| 4 | `STF-DTL` | Complaint Detail | Review & work on complaint | Update Status, Add Note, Resolve | Status timeline, photos, map, internal notes, public comments | Single complaint full data | Default, Loading, Error |
| 5 | `STF-UPD` | Status Update | Change complaint status | Confirm Update | Status selector, remarks textarea, submit | Current complaint | Default, Confirming, Submitting, Success, Error |
| 6 | `STF-RSL` | Resolution Evidence | Submit repair proof | Upload Evidence, Submit | Photo upload, completion notes, before/after | Current complaint | Default, Uploading, Submitting, Success, Error |
| 7 | `STF-INT` | Internal Notes | Add staff-only notes | Post Note | Note textarea, history list | Complaint internal notes | Default, Posting, Success |
| 8 | `STF-PRF` | Staff Profile | View account info | Sign Out | Name, department, org, settings | Staff profile | Default |

---

## 3. Admin Web Portal (React + Vite)

| # | Screen ID | Screen Name | Purpose | Primary Actions | Key Components | Data Requirements | States |
|:-:|:---|:---|:---|:---|:---|:---|:---|
| 1 | `ADM-LOG` | Admin Login | Authenticate admin | Sign In | Email, password, branding | None | Default, Error, Loading |
| 2 | `ADM-DSH` | Admin Dashboard | Operational KPI overview | View Details, Navigate | Stats cards, trend chart, category chart, recent activity | Org-wide metrics | Default, Loading, Error |
| 3 | `ADM-CMP` | Complaint Management | Browse all org complaints | Search, Filter, View, Assign | Table, search, filters, pagination, action menu | All org complaints | Default, Loading, Empty, No Results, Error |
| 4 | `ADM-CDT` | Complaint Detail | Admin complaint view | Triage, Assign, Override Status | Full detail, timeline, audit trail, assignment history | Single complaint + audit | Default, Loading, Error |
| 5 | `ADM-ASN` | Assignment Modal | Assign staff to complaint | Select Staff, Confirm | Department filter, staff selector, notes | Eligible staff list | Default, Assigning, Success, Error |
| 6 | `ADM-USR` | User Management | Browse all users | Search, View, Activate/Deactivate | User table, filters, status badges | All org users | Default, Loading, Empty, Error |
| 7 | `ADM-SPR` | Staff Provisioning | Create staff accounts | Create Account | Form: name, email, role, department | Departments list | Default, Validating, Submitting, Success, Error |
| 8 | `ADM-STF` | Staff Directory | Manage staff roster | View, Edit, Deactivate | Staff table, department filter, workload badges | Staff memberships | Default, Loading, Empty, Error |
| 9 | `ADM-DPT` | Department Management | Manage departments | Create, Edit, Deactivate | Department table/cards, staff count, workload | Departments + staff counts | Default, Loading, Empty, Error |
| 10 | `ADM-DPF` | Department Form | Create/edit department | Save | Name, code, head-of-dept selector | Department data, staff list | Default, Validating, Saving, Success |
| 11 | `ADM-CTG` | Category Management | Manage complaint categories | Create, Edit, Toggle Active | Category table, SLA info, active toggle | Categories + departments | Default, Loading, Empty, Error |
| 12 | `ADM-CTF` | Category Form | Create/edit category | Save | Name, description, department, SLA, priority, icon | Category data, departments | Default, Validating, Saving, Success |
| 13 | `ADM-RPT` | Reports & Analytics | Operational analytics | Filter, Export | Charts, date range, department filter, export button | Aggregated metrics | Default, Loading, Error |
| 14 | `ADM-AUD` | Audit Logs | Compliance audit trail | Search, Filter | Audit table, actor, action, timestamp, search | Audit records | Default, Loading, Empty, Error |
| 15 | `ADM-ORG` | Organization Settings | Org configuration | Save Settings | Org profile, workflow config, notification prefs | Org settings | Default, Saving, Success |
