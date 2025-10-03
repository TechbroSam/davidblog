// src/components/Header.tsx
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            David Samora
          </h1>
        </Link>
        <ThemeSwitcher />
      </div>
    </header>
  );
}