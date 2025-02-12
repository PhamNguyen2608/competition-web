import React from 'react';
import { Header } from './components/header';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="public-layout">
      <Header />
      <Outlet />
    </div>
  );
};
