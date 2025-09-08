// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} David Samora&apos;s Space.
            <br className="sm:hidden" /> All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}