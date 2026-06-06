'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../auth.css';
import api from '../../lib/api';
import users from '../../lib/ENDPOINTS';

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
}).required();

type FormData = yup.InferType<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post(users.FORGOT_PASSWORD, data);
      setSuccess('An email has been sent to your email address with password reset instructions.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container animate-fade-in">
      <div className="glass-panel auth-card animate-fade-in delay-100">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'var(--success, #10b981)', textAlign: 'center', marginBottom: '10px' }}>{success}</div>}
        
        <form className="auth-form animate-fade-in delay-200" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              {...register('email')}
              style={{ borderColor: errors.email ? 'var(--danger)' : '' }}
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="auth-footer animate-fade-in delay-300">
          <p>Remember your password? <Link href="/login" className="auth-link">Sign in</Link></p>
        </div>
      </div>
    </main>
  );
}
