'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import { getExpenses } from '../../../lib/features/expenses/expenseSlice';
import { getDashboardSummary } from '../../../lib/features/dashboard/dashboardSlice';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Loader2 } from 'lucide-react';
export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { summary, loading } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getExpenses());
    dispatch(getDashboardSummary());
  }, [dispatch]);
  // Derive metrics
  // Assuming positive amounts are expenses and income might be derived differently later.
  // For now, let's calculate total expense and mock income to demonstrate UI.
  // Use real data from the backend
  const totalBalance = summary?.totalBalance || 0;
  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const savings = summary?.savings || 0;
  // Mock data for now
  // const totalBalance = 5430.50;
  // const totalIncome = 8250.00;
  // const totalExpense = 2819.50;
  // const savings = totalIncome - totalExpense;
  // Format currency in INR
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };


  return (
    <>
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3>Welcome back, {user?.name || 'User'}!</h3>
        <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>Here is your financial overview.</p>
      </div>

      <div className="summary-grid">
        <div className="glass-panel summary-card">
          <div className="summary-header">
            <span className="summary-title">Total Balance</span>
            <div className="summary-icon-wrapper icon-blue">
              <Wallet size={24} />
            </div>
          </div>
          <div className="summary-amount">{formatCurrency(totalBalance)}</div>
        </div>

        {/* Total Income */}
        <div className="glass-panel summary-card">
          <div className="summary-header">
            <span className="summary-title">Total Income</span>
            <div className="summary-icon-wrapper icon-green">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="summary-amount">{formatCurrency(totalIncome)}</div>
        </div>

        {/* Total Expense */}
        <div className="glass-panel summary-card">
          <div className="summary-header">
            <span className="summary-title">Total Expense</span>
            <div className="summary-icon-wrapper icon-red">
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="summary-amount">{formatCurrency(totalExpense)}</div>
        </div>

        {/* Savings */}
        <div className="glass-panel summary-card">
          <div className="summary-header">
            <span className="summary-title">Savings</span>
            <div className="summary-icon-wrapper icon-purple">
              <PiggyBank size={24} />
            </div>
          </div>
          <div className="summary-amount">{formatCurrency(savings)}</div>
        </div>
      </div>
    </>
  );
}
