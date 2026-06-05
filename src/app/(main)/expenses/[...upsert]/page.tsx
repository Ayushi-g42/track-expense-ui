'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import { createExpense, updateExpenses } from '../../../../lib/features/expenses/expenseSlice';
import '../../../auth.css'; // Reusing auth CSS for form styling

// Using standard input date. The backend uses z.date().optional()
const expenseSchema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().optional(),
  paymentMethod: yup.string().oneOf(['UPI', 'Debit Card', 'Credit Card'], 'Invalid Payment Method').required('Payment Method is required'),
  expenseDate: yup.string().required('Date is required'),
  receiptUrl: yup.string().url('Must be a valid URL').optional().nullable(),
}).required();

type ExpenseFormData = yup.InferType<typeof expenseSchema>;

export default function CreateExpense() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { upsert } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, expensesList } = useAppSelector((state) => state.expenses);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(expenseSchema),
  });

  useEffect(() => {
    // upsert[0] is 'edit', upsert[1] is the ID
    if (upsert?.[0] === 'edit' && upsert?.[1]) {
      // Use .find() instead of .filter() to get a single object
      const expense = expensesList.find((i: any) => i._id === upsert[1]);

      if (expense) {
        // HTML date inputs expect YYYY-MM-DD format
        const formattedDate = expense.expenseDate
          ? new Date(expense.expenseDate).toISOString().split('T')[0]
          : '';

        // Populate the form with the existing expense data
        reset({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          paymentMethod: (expense.paymentMethod || undefined) as any,
          expenseDate: formattedDate,
          description: expense.description || undefined,
          receiptUrl: expense.receiptUrl || undefined,
        });
      }
    }
  }, [upsert, expensesList, reset]);


  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      // Ensure empty strings for optional fields are undefined to pass Zod validation
      receiptUrl: data.receiptUrl || undefined,
      description: data.description || undefined,
    };

    if (upsert?.[0] === 'edit' && upsert?.[1]) {
      const id = upsert[1];
      const resultAction = await dispatch(updateExpenses({ id, expenseData: submitData }));
      if (updateExpenses.fulfilled.match(resultAction)) {
        router.push('/expenses');
      }
    } else {
      const resultAction = await dispatch(createExpense(submitData));
      if (createExpense.fulfilled.match(resultAction)) {
        router.push('/expenses');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Create New Expense</h3>

        {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Grocery Shopping"
              style={{ borderColor: errors.title ? 'var(--danger)' : '' }}
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                {...register('amount')}
                placeholder="0.00"
                style={{ borderColor: errors.amount ? 'var(--danger)' : '' }}
              />
              {errors.amount && <p className="error-text">{errors.amount.message}</p>}
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                defaultValue=""
                {...register('category')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${errors.category ? 'var(--danger)' : 'rgba(255, 255, 255, 0.1)'}`,
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              >
                <option value="" disabled>Select Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Others">Others</option>
              </select>
              {errors.category && <p className="error-text">{errors.category.message}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                defaultValue=""
                {...register('paymentMethod')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${errors.paymentMethod ? 'var(--danger)' : 'rgba(255, 255, 255, 0.1)'}`,
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              >
                <option value="" disabled>Select method</option>
                <option value="UPI">UPI</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Credit Card">Credit Card</option>
              </select>
              {errors.paymentMethod && <p className="error-text">{errors.paymentMethod.message}</p>}
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                {...register('expenseDate')}
                style={{ borderColor: errors.expenseDate ? 'var(--danger)' : '' }}
              />
              {errors.expenseDate && <p className="error-text">{errors.expenseDate.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              {...register('description')}
              placeholder="Additional details..."
            />
          </div>

          <div className="form-group">
            <label>Receipt URL (Optional)</label>
            <input
              type="url"
              {...register('receiptUrl')}
              placeholder="https://..."
              style={{ borderColor: errors.receiptUrl ? 'var(--danger)' : '' }}
            />
            {errors.receiptUrl && <p className="error-text">{errors.receiptUrl.message}</p>}
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => router.push('/expenses')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
