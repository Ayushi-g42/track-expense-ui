'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../auth.css';
import api from '../../lib/api';
import users from '../../lib/ENDPOINTS';

const resetPasswordSchema = yup.object({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
}).required();

type FormData = yup.InferType<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await api.put(`${users.RESET_PASSWORD}/${token}`, { password: data.password });
      setSuccess('Password has been successfully reset. You can now login.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The token might be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel auth-card animate-fade-in delay-100">
      <div className="auth-header">
        <h2>Reset Password</h2>
        <p>Enter your new password</p>
      </div>
      
      {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'var(--success, #10b981)', textAlign: 'center', marginBottom: '10px' }}>{success}</div>}
      
      <form className="auth-form animate-fade-in delay-200" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••" 
            {...register('password')}
            style={{ borderColor: errors.password ? 'var(--danger)' : '' }}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            placeholder="••••••••" 
            {...register('confirmPassword')}
            style={{ borderColor: errors.confirmPassword ? 'var(--danger)' : '' }}
          />
          {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="btn-primary btn-full" disabled={loading || !token}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <div className="auth-footer animate-fade-in delay-300">
        <p>Back to <Link href="/login" className="auth-link">Sign in</Link></p>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <main className="auth-container animate-fade-in">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
