# CivicFix Wireframe Descriptions
**Phase:** Day 2: UI/UX Design

*Low-fidelity layout descriptions for every major screen. These describe spatial arrangement, component hierarchy, and content zones. The interactive prototype in `design-prototype/` implements these as high-fidelity screens.*

---

## Citizen Mobile App Screens

### CIT-SPL: Splash Screen
```
┌─────────────────────────┐
│                         │
│                         │
│      [CivicFix Logo]    │
│       Location Pin +    │
│       Checkmark Icon    │
│                         │
│      "CivicFix"         │
│   (Inter SemiBold 24px) │
│                         │
│  "Report It. Track It.  │
│   Improve Your City."   │
│     (Inter 14px gray)   │
│                         │
│     [Loading spinner]   │
│                         │
└─────────────────────────┘
Background: Primary gradient (#176B5B → #115447)
Text: White
Duration: 1.5s then auto-navigate
```

### CIT-REG: Registration Screen
```
┌─────────────────────────┐
│ ← Back                  │
│                         │
│  [CivicFix Logo Small]  │
│                         │
│  "Create your account"  │
│  "Join your community"  │
│                         │
│  Full Name              │
│  ┌─────────────────────┐│
│  │ Enter your name     ││
│  └─────────────────────┘│
│                         │
│  Email Address          │
│  ┌─────────────────────┐│
│  │ email@example.com   ││
│  └─────────────────────┘│
│                         │
│  Password               │
│  ┌──────────────────[👁]┐│
│  │ ••••••••            ││
│  └─────────────────────┘│
│  Min 8 chars, 1 number  │
│                         │
│  Confirm Password       │
│  ┌──────────────────[👁]┐│
│  │ ••••••••            ││
│  └─────────────────────┘│
│                         │
│  ☑ I agree to Terms     │
│                         │
│  ┌─────────────────────┐│
│  │  CREATE ACCOUNT     ││
│  └─────────────────────┘│
│                         │
│  Already have account?  │
│  Sign In                │
└─────────────────────────┘
```

### CIT-HOM: Home Dashboard
```
┌─────────────────────────┐
│ [Avatar] Good morning,  │
│          Priya       🔔 │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │  📢 Report an Issue │ │
│ │  Report a civic     │ │
│ │  problem near you   │ │
│ └─────────────────────┘ │
│                         │
│ ┌──────┐ ┌──────┐      │
│ │  3   │ │  1   │      │
│ │Total │ │Active│      │
│ └──────┘ └──────┘      │
│ ┌──────┐ ┌──────┐      │
│ │  2   │ │  0   │      │
│ │Rslvd │ │Pendng│      │
│ └──────┘ └──────┘      │
│                         │
│ Recent Complaints       │
│ ┌─────────────────────┐ │
│ │ 🟦 CF-2026-BLR-001  │ │
│ │ Pothole on Main Rd  │ │
│ │ In Progress · 2d ago│ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🟩 CF-2026-BLR-002  │ │
│ │ Broken Streetlight   │ │
│ │ Resolved · 5d ago   │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ 🏠  📋  📍  👤         │
│ Home List Map Profile   │
└─────────────────────────┘
Bottom nav: Home, My Complaints, Map, Profile
```

### CIT-CAT: Category Selection (Step 1)
```
┌─────────────────────────┐
│ ← Report an Issue       │
│ Step 1 of 5             │
│ ━━━━━○○○○               │
│                         │
│ "What type of problem?" │
│                         │
│ ┌──────────┐┌──────────┐│
│ │ 🕳️       ││ 🗑️       ││
│ │ Roads &  ││ Garbage &││
│ │ Potholes ││ Sanitation│
│ └──────────┘└──────────┘│
│ ┌──────────┐┌──────────┐│
│ │ 💡       ││ 💧       ││
│ │ Street-  ││ Water    ││
│ │ lights   ││ Supply   ││
│ └──────────┘└──────────┘│
│ ┌──────────┐┌──────────┐│
│ │ 🌊       ││ 🏗️       ││
│ │ Drainage ││ Public   ││
│ │          ││ Infra    ││
│ └──────────┘└──────────┘│
│ ┌──────────────────────┐│
│ │ ⋯ Other             ││
│ └──────────────────────┘│
└─────────────────────────┘
Cards: 2-column grid, large touch targets (min 88px tall)
Selected state: primary border + light primary background
```

### CIT-DTL: Complaint Detail & Tracking
```
┌─────────────────────────┐
│ ← Complaint Detail      │
│                         │
│ CF-2026-BLR-001042      │
│ [🟦 In Progress]        │
│                         │
│ Pothole on Main Road    │
│ Roads & Potholes        │
│ Submitted Oct 26, 2026  │
│                         │
│ ┌─────────────────────┐ │
│ │ [Photo 1] [Photo 2] │ │
│ └─────────────────────┘ │
│                         │
│ 📍 100ft Road, Koramang │
│ ┌─────────────────────┐ │
│ │    [Map Preview]     │ │
│ └─────────────────────┘ │
│                         │
│ Description             │
│ Large pothole near bus  │
│ stand junction...       │
│                         │
│ ─── Status Timeline ─── │
│ ● In Progress           │
│ │ Oct 28 · Staff started│
│ ● Assigned              │
│ │ Oct 27 · Assigned to  │
│ │ Roads Department      │
│ ● Verified              │
│ │ Oct 27 · Verified     │
│ ● Submitted             │
│   Oct 26 · You reported │
│                         │
│ ─── Updates ──────────  │
│ (Public comments here)  │
│                         │
├─────────────────────────┤
│ 🏠  📋  📍  👤         │
└─────────────────────────┘
If RESOLVED: Show feedback/reopen buttons
```

---

## Staff Web Portal Screens

### STF-DSH: Staff Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] CivicFix Staff          🔔 Notifications  [Avatar] ▾   │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ Dashboard│  Welcome back, Ramesh                                │
│ Queue    │  Roads & Infrastructure Department                    │
│ Profile  │                                                      │
│          │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│          │  │   5    │ │   2    │ │   2    │ │   1    │        │
│          │  │Assigned│ │In Prog │ │Resolved│ │Overdue │        │
│          │  └────────┘ └────────┘ └────────┘ └────────┘        │
│          │                                                      │
│          │  Recent Activity                                     │
│          │  ┌──────────────────────────────────────────────┐    │
│          │  │ CF-001042 · Status changed to In Progress    │    │
│          │  │ CF-001039 · New assignment received          │    │
│          │  │ CF-001035 · Resolution accepted              │    │
│          │  └──────────────────────────────────────────────┘    │
│          │                                                      │
│          │  Assigned Complaints (Needs Action)                  │
│          │  ┌─────────────────────────────────────────────┐     │
│          │  │ Ref  │ Title          │ Status   │ Due     │     │
│          │  │──────│────────────────│──────────│─────────│     │
│          │  │ 1042 │ Pothole Main   │ Assigned │ 6h left │     │
│          │  │ 1039 │ Road crack 5th │ Assigned │ 18h     │     │
│          │  └─────────────────────────────────────────────┘     │
└──────────┴──────────────────────────────────────────────────────┘
Sidebar: Collapsible on tablet/mobile
```

### STF-DTL: Complaint Detail (Staff View)
```
┌──────────┬──────────────────────────────────────────────────────┐
│ Sidebar  │  ← Back to Queue                                     │
│          │                                                      │
│          │  CF-2026-BLR-001042     [🟦 In Progress]             │
│          │  Pothole on Main Road                                │
│          │                                                      │
│          │  ┌─────────────────────┬───────────────────────┐     │
│          │  │                     │ Assignment Info        │     │
│          │  │  [Photo Gallery]    │ Dept: Roads & Infra    │     │
│          │  │  [Photo 1][Photo 2] │ Assigned: Oct 27       │     │
│          │  │                     │ SLA Due: Oct 29        │     │
│          │  ├─────────────────────┤                        │     │
│          │  │  📍 Location        │ Actions                │     │
│          │  │  [Map Preview]      │ ┌──────────────────┐   │     │
│          │  │  100ft Road...      │ │ ▶ Start Work     │   │     │
│          │  │                     │ └──────────────────┘   │     │
│          │  │  Description        │ ┌──────────────────┐   │     │
│          │  │  Large pothole...   │ │ ✓ Mark Resolved  │   │     │
│          │  │                     │ └──────────────────┘   │     │
│          │  └─────────────────────┴───────────────────────┘     │
│          │                                                      │
│          │  ─── Status Timeline ───                             │
│          │  (Same as citizen view)                               │
│          │                                                      │
│          │  ─── Public Updates ───                              │
│          │  (Comments visible to citizen)                        │
│          │                                                      │
│          │  ─── Internal Notes ─── [🔒 Staff Only]             │
│          │  ┌──────────────────────────────────────────────┐    │
│          │  │ "Awaiting asphalt delivery" - Ramesh, Oct 28 │    │
│          │  └──────────────────────────────────────────────┘    │
│          │  ┌──────────────────────────────────────────┐        │
│          │  │ Add internal note...              [Post] │        │
│          │  └──────────────────────────────────────────┘        │
└──────────┴──────────────────────────────────────────────────────┘
Internal notes section: Yellow/amber left border + lock icon
Clearly labeled "Staff Only — Not visible to citizens"
```

---

## Admin Web Portal Screens

### ADM-DSH: Admin Dashboard
```
┌──────────┬──────────────────────────────────────────────────────┐
│ Sidebar  │  Dashboard                                           │
│          │  Bengaluru East Ward Pilot                            │
│ Dashboard│                                                      │
│ Complnts │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│ Users    │  │  482   │ │   14   │ │   38   │ │   89   │       │
│ Staff    │  │ Total  │ │Pending │ │Active  │ │Resolved│       │
│ Depts    │  │        │ │Triage  │ │        │ │This Wk │       │
│ Categs   │  └────────┘ └────────┘ └────────┘ └────────┘       │
│ Reports  │                                                      │
│ Audit    │  ┌────────────────────┐ ┌────────────────────┐      │
│ Settings │  │ Complaint Trends   │ │ Category Breakdwn  │      │
│          │  │ [Line Chart]       │ │ [Donut Chart]      │      │
│          │  │ Last 30 days       │ │ Active complaints  │      │
│          │  └────────────────────┘ └────────────────────┘      │
│          │                                                      │
│          │  ┌────────────────────┐ ┌────────────────────┐      │
│          │  │ Dept Performance   │ │ Needs Attention    │      │
│          │  │ [Bar Chart]        │ │ 3 SLA Breaches     │      │
│          │  │ Avg resolution hrs │ │ 2 Reopen Requests  │      │
│          │  └────────────────────┘ │ 14 Awaiting Triage │      │
│          │                         └────────────────────┘      │
│          │                                                      │
│          │  Recent Activity                                     │
│          │  (Latest admin actions and complaint updates)         │
└──────────┴──────────────────────────────────────────────────────┘
All metrics labeled "Prototype / Demo Data"
Charts: Clean line/bar/donut — no 3D or decorative effects
```

### ADM-CMP: Complaint Management Table
```
┌──────────┬──────────────────────────────────────────────────────┐
│ Sidebar  │  Complaint Management                                │
│          │                                                      │
│          │  ┌──────────────────┐ [Status ▾] [Dept ▾] [Date ▾] │
│          │  │ 🔍 Search...     │                                │
│          │  └──────────────────┘                                │
│          │                                                      │
│          │  ┌─────────────────────────────────────────────────┐ │
│          │  │ Ref     │ Title      │ Cat  │ Status │ Staff │⋮││
│          │  │─────────│────────────│──────│────────│───────│ ││
│          │  │ CF-1042 │ Pothole... │ Roads│ 🟦 IP  │ Ramesh│⋮││
│          │  │ CF-1041 │ Garbage... │ Waste│ 🟨 UR  │   —   │⋮││
│          │  │ CF-1040 │ Street...  │ Elec │ 🟩 RSL │ Suresh│⋮││
│          │  │ CF-1039 │ Water l... │ Water│ 🟦 ASN │ Kumar │⋮││
│          │  └─────────────────────────────────────────────────┘ │
│          │                                                      │
│          │  Showing 1-20 of 482    [← 1 2 3 ... 25 →]         │
└──────────┴──────────────────────────────────────────────────────┘
Action menu (⋮): View, Assign, Triage, View Audit
Row hover: subtle background highlight
Status badges: colored pill with icon + text label
```

### ADM-ASN: Assignment Modal
```
┌────────────── Overlay ──────────────┐
│  ┌──────────────────────────────┐   │
│  │  Assign Complaint            │   │
│  │  CF-2026-BLR-001042          │   │
│  │                              │   │
│  │  Department                  │   │
│  │  ┌──────────────────────────┐│   │
│  │  │ Roads & Infrastructure ▾ ││   │
│  │  └──────────────────────────┘│   │
│  │                              │   │
│  │  Assign to Staff             │   │
│  │  ┌──────────────────────────┐│   │
│  │  │ Select staff member... ▾ ││   │
│  │  └──────────────────────────┘│   │
│  │  Available: Ramesh (2 active)│   │
│  │  Available: Suresh (4 active)│   │
│  │                              │   │
│  │  Notes                       │   │
│  │  ┌──────────────────────────┐│   │
│  │  │ Assignment notes...      ││   │
│  │  └──────────────────────────┘│   │
│  │                              │   │
│  │  [Cancel]  [Confirm Assign]  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
Staff selector shows workload count
Only eligible staff from the correct department shown
```
