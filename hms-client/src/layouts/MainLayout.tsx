import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/layouts/MainLayout.scss';

const MainLayout = () => {
  return (
    <div className="hms-main-layout">
      {/* 1. Permanent Sidebar */}
      <Sidebar />

      <div className="main-content-wrapper">
        {/* 2. Top Header / Navbar */}
        <Navbar />

        {/* 3. Scrollable Page Content */}
        <main className="page-body">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;