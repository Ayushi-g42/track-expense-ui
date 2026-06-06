'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { logout } from '../../lib/features/auth/authSlice';
import { ThemeToggle } from './ThemeToggle';

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
      <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle />
        {user && (() => {
          const profileImg = user?.profileImg ?? null;

          return (
            <Link href="/update-profile" style={{ textDecoration: 'none' }}>
              <div className="profile-avatar" title="Update Profile">
                {profileImg ? (
                  <div
                    className="avatar-image"
                    style={{ backgroundImage: `url(${profileImg})` }}
                  />
                ) : (
                  <div className="avatar-initials">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
          );
        })()}
        <button onClick={handleLogout} className="logout-btn">
          Log Out
        </button>
      </div>
    </header>
  );
}
