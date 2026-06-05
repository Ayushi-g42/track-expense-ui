'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../auth.css';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { loginUser } from '../../lib/features/auth/authSlice';

// Validation Schema using Yup
const loginSchema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

type LoginFormData = yup.InferType<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // Redirect if user is logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard'); // or wherever you want to go after login
    }
  }, [user, router]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(loginUser(data));
  };

  return (
    <main className="auth-container animate-fade-in">
      <div className="glass-panel auth-card animate-fade-in delay-100">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Enter your details to access your account</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
        
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
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              {...register('password')}
              style={{ borderColor: errors.password ? 'var(--danger)' : '' }}
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer animate-fade-in delay-300">
          <p>Don't have an account? <Link href="/register" className="auth-link">Sign up</Link></p>
        </div>
      </div>
    </main>
  );
}
