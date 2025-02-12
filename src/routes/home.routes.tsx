// routes/home.routes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { protectedLoader } from './loaders';
import { PublicLayout } from '../components/layout/PublicLayout';

const HomePage = lazy(() => import('../components/layout/main/MainLayout'));
const Analytics = lazy(() => import('../components/layout/main/MainLayout'));
const Reports = lazy(() => import('../components/layout/main/MainLayout'));

const homeRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    loader: protectedLoader,
    children: [
      {
        path: '/home',
        element: <HomePage />,
        children: [
          {
            path: 'analytics',
            element: <Analytics />
          },
          {
            path: 'reports',
            element: <Reports />
          }
        ]
      }
    ]
  }
];

export default homeRoutes;
