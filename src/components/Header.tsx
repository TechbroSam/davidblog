// src/components/Header.tsx
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';


export default function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-xs sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            David Samora
          </h1>
        </Link>
        <ThemeSwitcher/>
      </div>
    </header>
  );
}