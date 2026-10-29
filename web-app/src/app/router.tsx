import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { StaffLayout } from '../layouts/StaffLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Route Guards
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { RoleGuard } from '../routes/RoleGuard';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Citizen Pages
import { CitizenDashboardPage } from '../pages/citizen/CitizenDashboardPage';
import { CitizenComplaintsPage } from '../pages/citizen/CitizenComplaintsPage';
import { NewComplaintPage } from '../pages/citizen/NewComplaintPage';
import { CitizenNotificationsPage } from '../pages/citizen/CitizenNotificationsPage';
import { CitizenProfilePage } from '../pages/citizen/CitizenProfilePage';

// Staff Pages
import { StaffDashboardPage } from '../pages/staff/StaffDashboardPage';
import { StaffComplaintsPage } from '../pages/staff/StaffComplaintsPage';
import { StaffComplaintDetailPage } from '../pages/staff/StaffComplaintDetailPage';
import { StaffAssignedPage } from '../pages/staff/StaffAssignedPage';
import { StaffProfilePage } from '../pages/staff/StaffProfilePage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminComplaintsPage } from '../pages/admin/AdminComplaintsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminStaffPage } from '../pages/admin/AdminStaffPage';
import { AdminDepartmentsPage } from '../pages/admin/AdminDepartmentsPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';

// Platform Admin Page
import { PlatformAdminDashboardPage } from '../pages/platform-admin/PlatformAdminDashboardPage';

export const router = createBrowserRouter([
  // 1. Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },

  // 2. Citizen Experience (Protected: citizen only)
  {
    path: '/citizen',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['citizen']}>
          <CitizenLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/citizen/dashboard" replace /> },
      { path: 'dashboard', element: <CitizenDashboardPage /> },
      { path: 'complaints', element: <CitizenComplaintsPage /> },
      { path: 'complaints/new', element: <NewComplaintPage /> },
      { path: 'notifications', element: <CitizenNotificationsPage /> },
      { path: 'profile', element: <CitizenProfilePage /> },
    ],
  },

  // 3. Staff Experience (Protected: staff, department_supervisor)
  {
    path: '/staff',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['staff', 'department_supervisor']}>
          <StaffLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/staff/dashboard" replace /> },
      { path: 'dashboard', element: <StaffDashboardPage /> },
      { path: 'complaints', element: <StaffComplaintsPage /> },
      { path: 'complaints/:id', element: <StaffComplaintDetailPage /> },
      { path: 'assigned-complaints', element: <StaffAssignedPage /> },
      { path: 'profile', element: <StaffProfilePage /> },
    ],
  },

  // 4. Administration Experience (Protected: organization_admin, platform_admin)
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['organization_admin', 'platform_admin']}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'complaints', element: <AdminComplaintsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'staff', element: <AdminStaffPage /> },
      { path: 'departments', element: <AdminDepartmentsPage /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
      { path: 'audit-logs', element: <AdminAuditLogsPage /> },
    ],
  },

  // 5. Platform Super-Administration (Protected: platform_admin only)
  {
    path: '/platform-admin',
    element: (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['platform_admin']}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/platform-admin/dashboard" replace /> },
      { path: 'dashboard', element: <PlatformAdminDashboardPage /> },
    ],
  },

  // 6. Unknown Routes Catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
