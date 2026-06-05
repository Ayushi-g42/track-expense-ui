'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { logout } from '../../lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const getPageTitle = () => {
    if (pathname.includes('dashboard')) return 'Dashboard';
    if (pathname.includes('expenses')) return 'Expenses';
    return 'Overview';
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="dashboard-header">
      <h2 className="page-title">{getPageTitle()}</h2>
      <div className="user-profile">
        {user && <span className="user-name">{user.name}</span>}
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </header>
  );
}
