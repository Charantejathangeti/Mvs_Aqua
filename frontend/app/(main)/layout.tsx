import React from 'react';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css'; // Global CSS for Tailwind
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'Mvs_Aqua - The Aquatic Habitat',
  description: 'Your premium source for live fish, corals, and aquatic supplies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans bg-deep-sea text-pristine-water flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}