import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet /> {/* Child routes (Dashboard, UploadPage, etc.) will be rendered here */}
      </main>
    </div>
  );
};

export default MainLayout;