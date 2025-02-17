import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { protectedLoader } from './loaders';
import { PublicLayout } from '../components/layout/PublicLayout';

const LeaderboardPage = lazy(() => import('../pages/private/LeaderBoard/index'));

const adminRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    loader: protectedLoader,
    children: [
      {
        path: '/leaderboard',
        element: <LeaderboardPage />,
      }
    ]
  }
];

export default adminRoutes; 