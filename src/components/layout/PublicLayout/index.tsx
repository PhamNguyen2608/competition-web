import { Header } from './components/header';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Spinner } from '../../ui/spinner';

interface PublicLayoutProps {
  children?: React.ReactNode;
} 
export function PublicLayout({ children }: Readonly<PublicLayoutProps>) {
  return (
    <div className="public-layout">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Spinner size="xl" />
        </div>
      }>
        {children}
        <Outlet />
      </Suspense>
    </div>
  );
};
