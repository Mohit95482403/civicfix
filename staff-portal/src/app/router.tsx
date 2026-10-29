import { createBrowserRouter } from 'react-router-dom';
import { StaffLayout } from '../components/layout/StaffLayout';
import { StaffDashboard } from '../features/dashboard/StaffDashboard';
import { StaffLoginPage } from '../features/auth/StaffLoginPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <StaffLoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StaffDashboard />,
      },
      {
        path: 'tasks',
        element: <StaffDashboard />,
      },
      {
        path: 'history',
        element: <StaffDashboard />,
      },
      {
        path: 'profile',
        element: <StaffDashboard />,
      },
    ],
  },
]);
