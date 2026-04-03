// src/app/dashboard/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckSquare, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'var(--surface1)', borderTopColor: 'var(--mauve)' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b"
        style={{ background: 'rgba(24, 24, 37, 0.85)', backdropFilter: 'blur(12px)', borderColor: 'var(--surface0)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--mauve)' }}>
              <CheckSquare size={16} color="var(--base)" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-base">
              Task<span style={{ color: 'var(--mauve)' }}>Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: 'var(--surface0)' }}>
              <User size={14} style={{ color: 'var(--mauve)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--subtext1)' }}>
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="btn-ghost flex items-center gap-2 text-sm"
              style={{ color: 'var(--subtext0)' }}
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
