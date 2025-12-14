import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mvs_Aqua - Admin Dashboard',
  description: 'Admin dashboard for managing Mvs_Aqua operations.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-140px)]"> {/* Adjusted min-h to account for header/footer */}
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-abyssal text-pristine-water p-4 md:p-6 shadow-lg md:mr-8 mb-4 md:mb-0 rounded-lg">
        <h2 className="text-xl font-montserrat font-bold text-coral-pop mb-6 border-b border-coral-pop pb-2">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/admin/dashboard" className="block p-3 rounded-md hover:bg-deep-sea transition-colors duration-200">
                Dashboard Home
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/products/fish" className="block p-3 rounded-md hover:bg-deep-sea transition-colors duration-200">
                Live Fish Management
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/invoicing" className="block p-3 rounded-md hover:bg-deep-sea transition-colors duration-200">
                Invoicing
              </Link>
            </li>
            {/* Add more admin links here */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow bg-deep-sea p-4 md:p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}
