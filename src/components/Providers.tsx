// src/components/Providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Optional: Force theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  );
}