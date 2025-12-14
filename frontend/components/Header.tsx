'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_COOKIE_NAME, USER_ROLE_COOKIE_NAME } from '../constants';
import { Role } from '../types';
import { useRouter } from 'next/navigation';
import Button from './Button';

const Header: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get(AUTH_TOKEN_COOKIE_NAME);
    const role = Cookies.get(USER_ROLE_COOKIE_NAME) as Role | undefined;
    setIsAuthenticated(!!token);
    setUserRole(role || null);
  }, []);

  const handleLogout = () => {
    Cookies.remove(AUTH_TOKEN_COOKIE_NAME);
    Cookies.remove(USER_ROLE_COOKIE_NAME);
    Cookies.remove('user_id'); // Also clear other user-related cookies
    Cookies.remove('user_username');
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/login');
  };

  return (
    <header className="bg-deep-sea text-pristine-water shadow-md sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center flex-wrap">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="https://picsum.photos/40/40" alt="Mvs_Aqua Logo" width={40} height={40} className="rounded-full" />
          <span className="text-2xl font-montserrat font-bold text-coral-pop">Mvs_Aqua</span>
        </Link>

        <nav className="flex items-center space-x-6 mt-4 md:mt-0">
          <Link href="/" className="hover:text-coral-pop transition-colors duration-200">
            Home
          </Link>
          <Link href="/products" className="hover:text-coral-pop transition-colors duration-200">
            Products
          </Link>
          <Link href="/cart" className="hover:text-coral-pop transition-colors duration-200">
            Cart
          </Link>
          {(userRole === 'ADMIN' || userRole === 'OWNER') && (
            <Link href="/admin/dashboard" className="hover:text-coral-pop transition-colors duration-200">
              Admin
            </Link>
          )}
          
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_OWNER_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Image src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon" width={20} height={20} className="mr-2" />
            Chat
          </Link>

          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
