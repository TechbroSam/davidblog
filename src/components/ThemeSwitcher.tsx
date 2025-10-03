// src/components/ThemeSwitcher.tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    console.log('Toggled to:', newTheme, 'Resolved theme:', resolvedTheme);
  };

  return (
    <button
      className="p-2 rounded-full transition-colors cursor-pointer hover:opacity-50 "
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}