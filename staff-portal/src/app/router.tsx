import { createBrowserRouter } from 'react-router-dom';
import { StaffLayout } from '../components/layout/StaffLayout';
import { StaffDashboard } from '../features/dashboard/StaffDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StaffLayout />,
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
