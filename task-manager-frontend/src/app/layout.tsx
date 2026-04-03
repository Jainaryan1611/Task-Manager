// src/app/layout.tsx
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Task Manager',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e1e2e',
                color: '#cdd6f4',
                border: '1px solid #313244',
                borderRadius: '10px',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#a6e3a1', secondary: '#1e1e2e' } },
              error: { iconTheme: { primary: '#f38ba8', secondary: '#1e1e2e' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
