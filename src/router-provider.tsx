// app/router-provider.tsx
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './routes';

export default function RouterProviderWrapper() {
  return <RouterProvider router={createRouter({ authEnabled: false })} />;
}
