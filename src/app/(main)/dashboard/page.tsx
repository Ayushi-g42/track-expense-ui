'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import { getExpenses } from '../../../lib/features/expenses/expenseSlice';
import { getDashboardSummary } from '../../../lib/features/dashboard/dashboardSlice';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Loader2 } from 'lucide-react';
import CategoryExpenseChart from '../../../components/dashboard/CategoryExpenseChart';
import ExpenseTrendGraph from '../../../components/dashboard/ExpenseTrendGraph';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const { summary, loading } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(getExpenses({}));
    dispatch(getDashboardSummary());
  }, [dispatch]);

  const totalBalance = summary?.totalBalance || 0;
  const totalIncome = summary?.totalIncome || 0;
  const totalExpense = summary?.totalExpense || 0;
  const savings = summary?.savings || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <>
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

        <div className="glass-panel summary-card">
          <div className="summary-header">
            <span className="summary-title">Total Income</span>
            <div className="summary-icon-wrapper icon-green">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="summary-amount">{formatCurrency(totalIncome)}</div>
        </div>

        <div className="glass-panel summary-card">
          <div className="summary-header">
            <span className="summary-title">Total Expense</span>
            <div className="summary-icon-wrapper icon-red">
              <TrendingDown size={24} />
            </div>
          </div>
          <div className="summary-amount">{formatCurrency(totalExpense)}</div>
        </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        <ExpenseTrendGraph data={summary?.expenseTrend} />
        <CategoryExpenseChart data={summary?.categoryWiseExpense} />
      </div>
    </>
  );
}
