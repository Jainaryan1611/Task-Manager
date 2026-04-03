// src/app/register/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, UserPlus, CheckSquare, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  { label: 'At least 8 characters', test: pw => pw.length >= 8 },
  { label: 'One uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { label: 'One number', test: pw => /[0-9]/.test(pw) },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const allRulesPassed = passwordRules.every(r => r.test(form.password));
    if (!allRulesPassed) {
      toast.error('Password does not meet requirements');
      return;
    }
    setIsLoading(true);
    try {
      await register(form.email, form.username, form.password);
      toast.success('Account created! Welcome!');
    } catch (err) {
      const error = err as AxiosError<{ error: string; errors?: Array<{ msg: string }> }>;
      const msg = error.response?.data?.errors?.[0]?.msg
        || error.response?.data?.error
        || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(203,166,247,0.08) 0%, transparent 70%)' }}>
      
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
          <span className="text-xl font-semibold">
            Task<span style={{ color: 'var(--mauve)' }}>Flow</span>
          </span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-semibold mb-1">Create account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--subtext0)' }}>
            Start managing your tasks today
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
                Username
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="johndoe"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
              />
              <p className="text-xs mt-1" style={{ color: 'var(--overlay1)' }}>
                Letters, numbers, and underscores only
              </p>
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
                  onFocus={() => setPasswordFocused(true)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                  style={{ color: 'var(--overlay1)' }}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password rules */}
              {(passwordFocused || form.password) && (
                <div className="mt-2 space-y-1">
                  {passwordRules.map(rule => {
                    const passed = rule.test(form.password);
                    return (
                      <div key={rule.label} className="flex items-center gap-2 text-xs">
                        {passed
                          ? <Check size={12} style={{ color: 'var(--green)' }} />
                          : <X size={12} style={{ color: 'var(--overlay1)' }} />}
                        <span style={{ color: passed ? 'var(--green)' : 'var(--overlay1)' }}>
                          {rule.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--subtext1)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>
                  Passwords do not match
                </p>
              )}
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
                <UserPlus size={16} />
              )}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--subtext0)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--mauve)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
