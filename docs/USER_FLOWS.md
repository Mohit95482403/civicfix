# CivicFix User Flows
**Phase:** Day 2: UI/UX Design

---

## 1. Citizen Registration & Login

```
[App Launch] → [Splash Screen (1.5s)] → [Check Auth State]
                                              │
                          ┌───────────────────┼───────────────────┐
                          │ First Launch      │ No Token          │ Valid Token
                          ▼                   ▼                   ▼
                    [Onboarding]         [Login Screen]      [Home Dashboard]
                    │ Skip/Done │              │
                    ▼           │              ├─ Enter email + password
               [Login Screen] ◄┘              ├─ Tap "Sign In"
                    │                         ├─ [Loading state]
                    ├─ Tap "Create Account"   ├─ Success → [Home Dashboard]
                    ▼                         └─ Error → Show inline error
              [Registration]
                    │
                    ├─ Fill: Name, Email, Password, Confirm Password
                    ├─ Accept Terms
                    ├─ Tap "Create Account"
                    ├─ [Loading state]
                    ├─ Success → [Home Dashboard]
                    └─ Error → Show inline validation errors
```

---

## 2. Citizen Submits a Complaint

```
[Home Dashboard] → Tap "Report an Issue"
        │
        ▼
[Step 1: Select Category]
        │ Tap category card (e.g., "Potholes & Roads")
        ▼
[Step 2: Problem Details]
        │ Enter title (10-200 chars)
        │ Enter description (20-2000 chars)
        │ Tap "Next"
        ▼
[Step 3: Add Photos]
        │ Tap "Take Photo" → Camera → Preview → Add
        │ Tap "Choose from Gallery" → Picker → Preview → Add
        │ (1-3 photos required)
        │ Tap "Next"
        ▼
[Step 4: Select Location]
        │ Auto-detect GPS → Show map with pin
        │ OR Search address → Place pin
        │ OR Manual entry (if GPS denied)
        │ Confirm address text
        │ Tap "Next"
        ▼
[Step 5: Review & Submit]
        │ Review: Category, Title, Description, Photos, Location
        │ Tap "Edit" on any section to go back
        │ Tap "Submit Report"
        │ [Loading state - button disabled, spinner]
        │ [Prevent double-tap]
        ▼
[Step 6: Confirmation]
        │ Show: ✓ Success icon
        │ Show: Tracking Reference (e.g., CF-2026-BLR-001042)
        │ Show: Summary
        │ Tap "View Complaint" → [Complaint Detail]
        │ Tap "Back to Home" → [Home Dashboard]
```

---

## 3. Citizen Tracks a Complaint

```
[Home Dashboard] → Tap active complaint card
        │         OR tap "My Complaints"
        ▼
[Complaint List]
        │ Search by reference or title
        │ Filter by status chips
        │ Tap complaint card
        ▼
[Complaint Detail]
        │ View: Reference, Title, Category, Status Badge
        │ View: Submitted photos
        │ View: Location on map
        │ View: Status Timeline (chronological entries)
        │   Each entry: Status → Timestamp → Explanation
        │ View: Public comments/updates
        │ View: Resolution evidence (if resolved)
        │
        │ If status = RESOLVED:
        │   Tap "Rate & Close" → [Feedback Flow]
        │   Tap "Issue Not Fixed" → [Reopen Flow]
```

---

## 4. Citizen Provides Feedback

```
[Complaint Detail (RESOLVED)] → Tap "Rate & Close"
        │
        ▼
[Feedback Screen]
        │ Tap star rating (1-5 stars)
        │ Optional: Write comment
        │ Tap "Submit Feedback"
        │ [Loading state]
        │ Success → Complaint transitions to CLOSED
        │ Success → Show confirmation toast
        │ Return to [Complaint Detail (CLOSED)]
```

---

## 5. Citizen Reopens a Complaint

```
[Complaint Detail (RESOLVED)] → Tap "Issue Not Fixed"
        │
        ▼
[Reopen Request Screen]
        │ Enter reason (min 15 chars)
        │ Tap "Request Reopen"
        │ [Confirmation dialog: "Are you sure?"]
        │ Confirm → [Loading state]
        │ Success → Complaint transitions to REOPENED
        │ Success → Show confirmation toast
        │ Success → Supervisor alerted
        │ Return to [Complaint Detail (REOPENED)]
        │
        │ Error: "48-hour window expired" → Show error message
```

---

## 6. Staff Reviews & Updates a Complaint

```
[Staff Login] → Authenticate → [Staff Dashboard]
        │
        ▼
[Staff Dashboard] → View assigned stats → Tap complaint or "View Queue"
        │
        ▼
[Complaint Queue]
        │ Filter: Status, Category, Date
        │ Sort: Date, Priority
        │ Tap complaint row
        ▼
[Complaint Detail]
        │ View: All citizen-submitted info
        │ View: Photos, location map, timeline
        │ View: Internal notes (staff-only section)
        │
        │ Actions available based on current status:
        │
        │ If ASSIGNED → Tap "Start Work"
        │   Enter note (optional)
        │   Confirm → Status = IN_PROGRESS
        │   Citizen receives push notification
        │
        │ If IN_PROGRESS → Tap "Mark Resolved"
        │   → [Resolution Evidence Flow]
        │
        │ Any time → Tap "Add Internal Note"
        │   Enter note text
        │   Submit → Note saved (visible only to staff/supervisors)
```

---

## 7. Staff Submits Resolution Evidence

```
[Complaint Detail (IN_PROGRESS)] → Tap "Mark Resolved"
        │
        ▼
[Resolution Evidence Form]
        │ Upload repair photo(s) (mandatory, min 1)
        │   [Upload progress bar]
        │ Enter completion notes (min 10 chars)
        │ Tap "Submit Resolution"
        │ [Loading state]
        │ Success → Status = RESOLVED
        │ Success → Citizen receives push notification
        │ Show success toast
        │ Return to [Complaint Detail (RESOLVED)]
        │
        │ Error: Missing photo → Inline validation error
```

---

## 8. Admin Assigns Complaints

```
[Admin Login] → Authenticate → [Admin Dashboard]
        │
        ▼
[Admin Dashboard] → See "Awaiting Assignment" count → Tap
        │
        ▼
[Complaint Management Table]
        │ Filter: Status = VERIFIED (ready for assignment)
        │ Tap complaint row or "Assign" action
        ▼
[Complaint Detail (Admin View)]
        │ Review complaint info, photos, location
        │ View triage history
        │ Tap "Assign to Staff"
        ▼
[Assignment Modal]
        │ Select department (pre-filled from category)
        │ Select eligible staff member (filtered by department + availability)
        │ View staff current workload
        │ Enter assignment notes
        │ Tap "Confirm Assignment"
        │ [Loading state]
        │ Success → Status = ASSIGNED
        │ Success → Staff & Citizen receive notifications
        │ Close modal → Updated complaint detail
```

---

## 9. Admin Manages Staff & Departments

```
[Admin Sidebar] → Tap "Staff Management"
        │
        ▼
[Staff Directory]
        │ View all staff with department, role, workload
        │ Search, filter by department
        │ Tap "Add Staff Member"
        ▼
[Staff Provisioning Form]
        │ Enter: Full name, email, phone
        │ Select: Role (STAFF or SUPERVISOR)
        │ Select: Department
        │ Enter: Temporary password
        │ Tap "Create Account"
        │ [Loading state]
        │ Success → Staff account created
        │ Success → Show confirmation with credentials
        │ Audit log entry created
        │
        │ Navigate to department management:
[Admin Sidebar] → Tap "Departments"
        ▼
[Department Management]
        │ View departments with staff count, workload
        │ Tap "Create Department"
        ▼
[Department Form]
        │ Enter: Name, Code
        │ Select: Head of Department (from existing staff)
        │ Tap "Save"
        │ Success → Department created
```

---

## 10. Admin Triage Flow

```
[Complaint Management] → Filter: Status = SUBMITTED
        │ Tap complaint
        ▼
[Complaint Detail (Admin)]
        │ Review citizen submission
        │ View photos, location, description
        │
        ├─ Tap "Verify" → [Triage: Verify]
        │   Confirm department assignment
        │   Set priority (if different from default)
        │   Enter remarks
        │   Confirm → Status = VERIFIED → Ready for assignment
        │
        ├─ Tap "Reject" → [Triage: Reject]
        │   Enter mandatory rejection reason (min 15 chars)
        │   Confirm → Status = REJECTED → Citizen notified
        │
        └─ Tap "Mark Duplicate" → [Triage: Duplicate]
            Search for parent complaint
            Link to parent reference
            Enter explanation
            Confirm → Status = DUPLICATE → Citizen notified
```
