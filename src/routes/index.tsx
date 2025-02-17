// routes/index.tsx
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { publicRoutes } from './public.routes';
import homeRoutes from './home.routes';
import adminRoutes from './admin.routes';

const routeRegistry: Record<string, RouteObject[]> = {
  public: [...publicRoutes],
  protected: [...homeRoutes],
  admin: [...adminRoutes],
};

export const createRouter = (config: { authEnabled: boolean }) => {
  return createBrowserRouter([
    ...(config.authEnabled ? routeRegistry.admin : []),
    ...routeRegistry.protected,
    ...routeRegistry.public,
    {
      path: '*',
      element: <div>404 - Not Found</div>,
      handle: { seo: { title: '404 - Page Not Found' } },
    },
  ]);
};
