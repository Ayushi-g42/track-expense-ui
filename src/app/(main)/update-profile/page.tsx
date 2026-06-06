'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppSelector, useAppDispatch } from '../../../lib/hooks';
import '../../auth.css'; // Reusing auth CSS for form styling
import { updateProfile, uploadProfileImage } from '@/lib/features/auth/authSlice';
import api from '@/lib/api';
import { users } from '@/lib/ENDPOINTS';

const updateProfileSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters long').required('Name is required'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  // Removed profilePicture from required validation to handle file manually
}).required();

export default function UpdateProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await dispatch(uploadProfileImage(formData));
      setSelectedFile(uploadRes.payload.profileImg);
    }
  };

  const onSubmit = async (data: any) => {
    setSuccessMsg('');
    setUploading(true);
    try {
      // 2. Submit the profile update with the new or existing image URL
      const submitData = {
        ...data,
        profileImg: selectedFile,
      };

      const resultAction = await dispatch(updateProfile(submitData));
      if (updateProfile.fulfilled.match(resultAction)) {
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>Update Profile</h3>

        {error && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: '16px' }}>{error}</div>}
        {successMsg && <div style={{ color: 'var(--success)', textAlign: 'center', marginBottom: '16px' }}>{successMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="Your name"
              style={{ borderColor: errors.name ? 'var(--danger)' : '' }}
            />
            {errors.name && <p className="error-text">{errors.name?.message?.toString()}</p>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              {...register('email')}
              disabled
              placeholder="your@email.com"
              style={{ borderColor: errors.email ? 'var(--danger)' : '' }}
            />
            {errors.email && <p className="error-text">{errors.email?.message?.toString()}</p>}
          </div>

          <div className="form-group">
            <label>Profile Picture</label>

            {previewUrl && (
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center',
                  border: '2px solid var(--primary)'
                }} />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ padding: '8px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Select an image from your computer to upload.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={loading || uploading}
            >
              {loading || uploading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
