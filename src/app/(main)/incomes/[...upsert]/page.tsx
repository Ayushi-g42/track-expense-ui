'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../../../lib/hooks';
import { createIncome, updateIncome } from '../../../../lib/features/incomes/incomeSlice';
import '../../../auth.css'; // Reusing auth CSS for form styling

const incomeSchema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  source: yup.string().oneOf(['Salary', 'Freelance', 'Investment', 'Gifts', 'Others'], 'Invalid Source').required('Source is required'),
  description: yup.string().optional(),
  incomeDate: yup.string().required('Date is required'),
}).required();

type IncomeFormData = yup.InferType<typeof incomeSchema>;

export default function CreateIncome() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { upsert } = useParams();
  const { loading, error, incomesList } = useAppSelector((state) => state.incomes);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(incomeSchema),
  });

  useEffect(() => {
    // upsert[0] is 'edit', upsert[1] is the ID
    if (upsert?.[0] === 'edit' && upsert?.[1]) {
      const income = incomesList.find((i: any) => i._id === upsert[1]);

      if (income) {
        // HTML date inputs expect YYYY-MM-DD format
        const formattedDate = income.incomeDate
          ? new Date(income.incomeDate).toISOString().split('T')[0]
          : '';

        // Populate the form with the existing income data
        reset({
          title: income.title,
          amount: income.amount,
          source: (income.source || undefined) as any,
          incomeDate: formattedDate,
          description: income.description || undefined,
        });
      }
    }
  }, [upsert, incomesList, reset]);


  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      // Ensure empty strings for optional fields are undefined
      description: data.description || undefined,
    };

    if (upsert?.[0] === 'edit' && upsert?.[1]) {
      const id = upsert[1];
      const resultAction = await dispatch(updateIncome({ id, incomeData: submitData }));
      if (updateIncome.fulfilled.match(resultAction)) {
        router.push('/incomes');
      }
    } else {
      const resultAction = await dispatch(createIncome(submitData));
      if (createIncome.fulfilled.match(resultAction)) {
        router.push('/incomes');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>{upsert?.[0] === 'edit' ? 'Edit Income' : 'Create New Income'}</h3>

        {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Monthly Salary"
              style={{ borderColor: errors.title ? 'var(--danger)' : '' }}
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Amount (₹)</label>
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
              <label>Source</label>
              <select
                defaultValue=""
                {...register('source')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${errors.source ? 'var(--danger)' : 'rgba(255, 255, 255, 0.1)'}`,
                  background: 'rgba(0, 0, 0, 0.2)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              >
                <option value="" disabled>Select Source</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Gifts">Gifts</option>
                <option value="Others">Others</option>
              </select>
              {errors.source && <p className="error-text">{errors.source.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              {...register('incomeDate')}
              style={{ borderColor: errors.incomeDate ? 'var(--danger)' : '' }}
            />
            {errors.incomeDate && <p className="error-text">{errors.incomeDate.message}</p>}
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              {...register('description')}
              placeholder="Additional details..."
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => router.push('/incomes')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
