import React from 'react'; // Fix: Explicitly import React to resolve "Cannot find namespace 'React'" error
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'Mvs_Aqua - Authentication',
  description: 'Login or sign up to Mvs_Aqua',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans bg-deep-sea text-pristine-water flex flex-col min-h-screen items-center justify-center p-4">
        <div className="bg-abyssal p-8 rounded-lg shadow-xl w-full max-w-md">
          {children}
        </div>
      </body>
    </html>
  );
}