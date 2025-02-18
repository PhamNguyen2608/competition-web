// routes/home.routes.tsx
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { protectedLoader } from './loaders';
import { PublicLayout } from '../components/layout/PublicLayout';
import  ExamQuestionPage  from '../pages/private/ExamQuestion';
import { ExamGuard } from '../pages/guard/ExamGuard';

const HomePage = lazy(() => import('../components/layout/main/MainLayout'));
const Analytics = lazy(() => import('../components/layout/main/MainLayout'));
const Reports = lazy(() => import('../components/layout/main/MainLayout'));
const ExamPage = lazy(() => import('../pages/private/Exam'));
const ExamResult = lazy(() => import('../components/layout/exam/ExamResult'));

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
        element: (
          <ExamGuard>
            <ExamPage />
          </ExamGuard>
        )
      },
      {
        path: '/exam/questions',
        element: (
          <ExamGuard>
            <ExamQuestionPage />
          </ExamGuard>
        )
      },
      {
        path: '/exam/result',
        element: <ExamResult />
      }
    ]
  }
];

export default homeRoutes;
