// app/router-provider.tsx
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './routes';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { useEffect } from 'react';
import { initAuth } from './features/auth/authSlice';
import { Spinner } from './components/ui/spinner';

export default function RouterProviderWrapper() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return <RouterProvider router={createRouter({ authEnabled: true })} />;
}
