// src/app/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(203,166,247,0.08) 0%, transparent 70%)' }}>
      
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(88,91,112,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(88,91,112,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--mauve)' }}>
            <CheckSquare size={20} color="var(--base)" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-semibold" style={{ color: 'var(--text)' }}>
            Task<span style={{ color: 'var(--mauve)' }}>Flow</span>
          </span>
        </div>

        {/* Card */}
        <div className="card p-8">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--subtext0)' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: 'var(--overlay1)' }}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 rounded-full animate-spin"
                  style={{ borderColor: 'var(--base)', borderTopColor: 'transparent' }} />
              ) : (
                <LogIn size={16} />
              )}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--subtext0)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--mauve)' }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <p className="text-xs text-center mt-4" style={{ color: 'var(--overlay0)' }}>
          Need to test? Register a new account above.
        </p>
      </div>
    </div>
  );
}
