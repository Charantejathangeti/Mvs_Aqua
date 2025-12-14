'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { API_BASE_URL } from '@/constants';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!username || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { username, password });
      setSuccess(response.data.message);
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-pristine-water">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-8 text-center">Register for Mvs_Aqua</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <Input
          label="Email"
          type="email"
          name="username"
          placeholder="your@email.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-deep-sea border-pristine-water text-pristine-water"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-deep-sea border-pristine-water text-pristine-water"
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          loading={loading}
        >
          Register
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-400">
          Already have an account? {' '}
          <Link href="/login" className="text-coral-pop hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}