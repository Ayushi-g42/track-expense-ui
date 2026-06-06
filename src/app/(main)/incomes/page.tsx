'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import { deleteIncome, getIncomes } from '../../../lib/features/incomes/incomeSlice';
import Table, { Column } from '../../../components/common/Table';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

export default function IncomesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { incomesList, loading, error } = useAppSelector((state) => state.incomes);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user || token) {
      dispatch(getIncomes());
    }
  }, [dispatch, user, token]);

  const handleEdit = (id: string) => {
    router.push(`/incomes/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setIncomeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (incomeToDelete) {
      await dispatch(deleteIncome({ id: incomeToDelete }));
      dispatch(getIncomes());
    }
    setIsDeleteModalOpen(false);
    setIncomeToDelete(null);
  };

  const columns: Column<any>[] = [
    {
      key: 'action',
      header: 'Action',
      render: (row) =>
        <div className="table-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div 
            onClick={() => handleEdit(row._id)} 
            style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            title="Edit"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
          <div 
            onClick={() => handleDeleteClick(row._id)} 
            style={{ cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            title="Delete"
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </div>
        </div>
    },
    { key: 'title', header: 'Title' },
    { key: 'source', header: 'Source' },
    { key: 'amount', header: 'Amount', render: (row) => `₹${row.amount.toFixed(2)}` },
    {
      key: 'incomeDate',
      header: 'Date',
      render: (row) => row.incomeDate ? new Date(row.incomeDate).toLocaleDateString() : 'N/A'
    },
  ];

  return (
    <div className="animate-fade-in">
      {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

      {loading && incomesList.length === 0 ? (
        <p>Loading incomes...</p>
      ) : (
        <Table
          title="Your Incomes"
          data={incomesList}
          columns={columns}
          createButtonText="+ Create Income"
          createButtonLink="/incomes/create"
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Income"
        message="Are you sure you want to delete this income? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
