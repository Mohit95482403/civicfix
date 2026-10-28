import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminDashboard } from '../features/dashboard/AdminDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
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
