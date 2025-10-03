// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "next-themes";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hi, I'm David Samora - My Space",
  description: "A personal blog and diary space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}