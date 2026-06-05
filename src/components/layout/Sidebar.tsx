'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"></div>
        <h1>Trackexpense</h1>
      </div>

      <nav className="sidebar-nav">
        <Link 
          href="/dashboard" 
          className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}
        >
          <span className="sidebar-icon">📊</span>
          Dashboard
        </Link>

        <Link 
          href="/expenses" 
          className={`sidebar-link ${pathname === '/expenses' ? 'active' : ''}`}
        >
          <span className="sidebar-icon">💸</span>
          Expenses
        </Link>
      </nav>
    </aside>
  );
}
