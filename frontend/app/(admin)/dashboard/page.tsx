'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { USER_USERNAME_COOKIE_NAME, USER_ROLE_COOKIE_NAME } from '@/constants';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUsername(Cookies.get(USER_USERNAME_COOKIE_NAME) || null);
    setUserRole(Cookies.get(USER_ROLE_COOKIE_NAME) as Role || null);
  }, []);

  // Mock KPIs
  const kpis = [
    { name: 'Total Orders (Pending)', value: 12, unit: '', color: 'text-coral-pop' },
    { name: 'Total Sales (Month)', value: '₹125,000', unit: '', color: 'text-seafoam-green' },
    { name: 'Live Fish Stock', value: 87, unit: 'items', color: 'text-pristine-water' },
    { name: 'New Customers (Week)', value: 5, unit: '', color: 'text-ocean-blue' },
  ];

  if (!username) {
    // This case should ideally be caught by middleware.ts, but for client-side rendering protection:
    return (
      <div className="text-center p-8 bg-abyssal rounded-lg">
        <h2 className="text-2xl font-montserrat font-bold text-red-500 mb-4">Access Denied</h2>
        <p className="text-lg text-pristine-water">You must be logged in as an Admin or Owner to view this page.</p>
        <button onClick={() => router.push('/login')} className="mt-4 px-6 py-2 bg-coral-pop rounded hover:bg-orange-600 text-white">Login</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-deep-sea rounded-lg shadow-lg">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-8">
        Welcome, {username} ({userRole})!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-abyssal p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <p className="text-pristine-water text-lg font-semibold mb-2">{kpi.name}</p>
            <p className={`text-4xl font-bold ${kpi.color}`}>{kpi.value} <span className="text-xl text-gray-400">{kpi.unit}</span></p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-montserrat font-semibold text-pristine-water mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/products/fish">
          <div className="bg-abyssal p-6 rounded-lg shadow-md hover:bg-deep-sea transition-colors duration-300 cursor-pointer">
            <h3 className="text-xl font-montserrat font-semibold text-coral-pop mb-2">Manage Live Fish</h3>
            <p className="text-pristine-water">Update stock, prices, and product details for live aquatic species.</p>
          </div>
        </Link>
        <Link href="/admin/invoicing">
          <div className="bg-abyssal p-6 rounded-lg shadow-md hover:bg-deep-sea transition-colors duration-300 cursor-pointer">
            <h3 className="text-xl font-montserrat font-semibold text-coral-pop mb-2">Process Invoices</h3>
            <p className="text-pristine-water">Confirm orders and generate client & audit invoices.</p>
          </div>
        </Link>
        {/* Add more quick action links here */}
        <div className="bg-abyssal p-6 rounded-lg shadow-md hover:bg-deep-sea transition-colors duration-300 cursor-pointer">
            <h3 className="text-xl font-montserrat font-semibold text-coral-pop mb-2">Customer Support</h3>
            <p className="text-pristine-water">View customer inquiries and feedback.</p>
          </div>
      </div>
    </div>
  );
}
