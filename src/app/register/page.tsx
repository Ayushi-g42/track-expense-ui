'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import '../auth.css';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { registerUser } from '../../lib/features/auth/authSlice';

// Validation Schema using Yup
const registerSchema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

type RegisterFormData = yup.InferType<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    // Inject default role as 'user' for backend API
    const submitData = { ...data, role: 'user' };
    const resultAction = await dispatch(registerUser(submitData));
    if (registerUser.fulfilled.match(resultAction)) {
      router.push('/login'); // Redirect to login on successful registration
    }
  };

  return (
    <main className="auth-container animate-fade-in">
      <div className="glass-panel auth-card animate-fade-in delay-100">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start tracking your expenses</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <form className="auth-form animate-fade-in delay-200" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe" 
              {...register('name')}
              style={{ borderColor: errors.name ? 'var(--danger)' : '' }}
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer animate-fade-in delay-300">
          <p>Already have an account? <Link href="/login" className="auth-link">Log in</Link></p>
        </div>
      </div>
    </main>
  );
}
