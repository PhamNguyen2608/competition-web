// routes/home.routes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { protectedLoader } from './loaders';
import { PublicLayout } from '../components/layout/PublicLayout';
import  ExamQuestionPage  from '../pages/private/ExamQuestion';

const HomePage = lazy(() => import('../components/layout/main/MainLayout'));
const Analytics = lazy(() => import('../components/layout/main/MainLayout'));
const Reports = lazy(() => import('../components/layout/main/MainLayout'));
const ExamPage = lazy(() => import('../pages/private/Exam'));

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
      },
      {
        path: '/exam',
        element: <ExamPage />
      },
      {
        path: '/exam/questions',
        element: <ExamQuestionPage />
      }
    ]
  }
];

export default homeRoutes;
