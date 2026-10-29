import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../features/dashboard/AdminDashboard';
import { AdminLoginPage } from '../features/auth/AdminLoginPage';
import { AdminProtectedRoute } from '../components/auth/AdminProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'triage',
        element: <AdminDashboard />,
      },
      {
        path: 'departments',
        element: <AdminDashboard />,
      },
      {
        path: 'staff',
        element: <AdminDashboard />,
      },
      {
        path: 'audit',
        element: <AdminDashboard />,
      },
    ],
  },
]);
