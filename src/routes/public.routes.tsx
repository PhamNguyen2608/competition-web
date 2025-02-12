import { lazy } from 'react';
import { AppRoute } from '@/types/routes';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Navigate } from 'react-router-dom';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/public/Login/index'));

/**
 * Public route configuration array
 * Add new public routes here following the same pattern
 */
export const publicRoutes: AppRoute[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <PublicLayout />,
    children: [
      {
        path: '',  // empty string for index route
        element: <LoginPage />
      }
    ],
    metadata: {
      title: 'Login - My App',
      description: 'User login page'
    }
  }
];
