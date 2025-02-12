// routes/index.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { publicRoutes } from './public.routes';
import homeRoutes from './home.routes';

const routeRegistry: Record<string, RouteObject[]> = {
  public: [...publicRoutes],
  protected: [...homeRoutes], 
  auth: [],
};

export const createRouter = (config: { authEnabled: boolean }) => {
  return createBrowserRouter([
    ...(config.authEnabled ? routeRegistry.auth : []),
    ...routeRegistry.protected,
    ...routeRegistry.public,
    {
      path: '*',
      element: <div>404 - Not Found</div>,
      handle: { seo: { title: '404 - Page Not Found' } },
    },
  ]);
};
