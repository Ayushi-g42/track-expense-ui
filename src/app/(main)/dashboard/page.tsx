'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../../lib/hooks';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="glass-panel" style={{ padding: '32px' }}>
      <h3>Welcome back, {user?.name || 'User'}!</h3>
      <p style={{ marginTop: '16px' }}>This is your main dashboard. Here you will see your financial overview.</p>
    </div>
  );
}
