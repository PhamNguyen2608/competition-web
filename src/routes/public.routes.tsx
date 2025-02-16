import { lazy } from 'react';
import { AppRoute } from '@/types/routes';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Navigate } from 'react-router-dom';
import { protectedLoader } from './loaders';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/public/Login/index'));
const RegisterPage = lazy(() => import('../pages/public/Register/index'));

/**
 * Public route configuration array
 * Add new public routes here following the same pattern
 */
export const publicRoutes: AppRoute[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />,
    loader: protectedLoader
  },
  {
    path: '/login',
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: <LoginPage />
      }
    ],
    metadata: {
      title: 'Login - My App',
      description: 'User login page'
    }
  },
  {
    path: '/register',
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: <RegisterPage />
      }
    ],
    metadata: {
      title: 'Register - My App',
      description: 'User registration page'
    }
  }
];
