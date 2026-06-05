import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout animate-fade-in">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="page-content delay-100 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
