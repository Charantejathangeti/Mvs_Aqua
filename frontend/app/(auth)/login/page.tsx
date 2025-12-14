'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { API_BASE_URL, AUTH_TOKEN_COOKIE_NAME, USER_ID_COOKIE_NAME, USER_ROLE_COOKIE_NAME, USER_USERNAME_COOKIE_NAME } from '@/constants';
import Link from 'next/link';

type LoginMethod = 'password' | 'otp';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password'); // Default to password login

  // Password Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Login States
  const [otpIdentifier, setOtpIdentifier] = useState(''); // Email or Phone for OTP
  const [otpCode, setOtpCode] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0); // Countdown in seconds
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown for resend OTP

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/'; // Default redirect to home

  useEffect(() => {
    // Use 'any' to handle potential type mismatch between Node.js Timeout and browser number
    let timerInterval: any;
    if (otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && otpRequested) {
      setOtpError('OTP has expired. Please request a new one.');
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [otpTimer, otpRequested]);

  useEffect(() => {
    // Use 'any' to handle potential type mismatch between Node.js Timeout and browser number
    let cooldownInterval: any;
    if (resendCooldown > 0) {
      cooldownInterval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (cooldownInterval) clearInterval(cooldownInterval);
    };
  }, [resendCooldown]);

  const setAuthCookies = (token: string, role: string, userId: string, username: string) => {
    Cookies.set(AUTH_TOKEN_COOKIE_NAME, token, { expires: 1, secure: process.env.NODE_ENV === 'production' });
    Cookies.set(USER_ROLE_COOKIE_NAME, role, { expires: 1, secure: process.env.NODE_ENV === 'production' });
    Cookies.set(USER_ID_COOKIE_NAME, userId, { expires: 1, secure: process.env.NODE_ENV === 'production' });
    Cookies.set(USER_USERNAME_COOKIE_NAME, username, { expires: 1, secure: process.env.NODE_ENV === 'production' });
  };

  // --- Password Login Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
      
      const { token, role, userId, username: loggedInUsername } = response.data;
      setAuthCookies(token, role, userId, loggedInUsername);

      alert('Login successful!');
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // --- OTP Login Handlers ---
  const handleRequestOtp = async () => {
    if (!otpIdentifier) {
      setOtpError('Please enter your email or phone number.');
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    setOtpCode(''); // Clear previous OTP

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/request-otp`, { username: otpIdentifier });
      setOtpRequested(true);
      setOtpTimer(60 * 5); // 5 minutes for OTP
      setResendCooldown(60); // 1 minute cooldown for resend
      alert(response.data.message + (process.env.NODE_ENV === 'development' ? ` OTP: ${response.data.otp}` : '')); // For demo, show OTP
    } catch (err: any) {
      console.error('Request OTP error:', err);
      setOtpError(err.response?.data?.message || 'Failed to request OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpIdentifier || !otpCode) {
      setOtpError('Please enter both your identifier and the OTP.');
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login-with-otp`, { username: otpIdentifier, otp: otpCode });
      
      const { token, role, userId, username: loggedInUsername } = response.data;
      setAuthCookies(token, role, userId, loggedInUsername);

      alert('Login successful via OTP!');
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Login with OTP error:', err);
      setOtpError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
      setOtpTimer(0); // Stop timer
    }
  };

  return (
    <div className="p-8 text-pristine-water">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-8 text-center">Login to Mvs_Aqua</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
          {error}
        </div>
      )}
      {otpError && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4 text-center">
          {otpError}
        </div>
      )}

      {searchParams.get('error') === 'session_expired' && (
        <div className="bg-yellow-500 text-white p-3 rounded-md mb-4 text-center">
          Your session has expired. Please log in again.
        </div>
      )}

      {/* Login Method Toggle */}
      <div className="flex justify-center space-x-4 mb-8">
        <Button 
          variant={loginMethod === 'password' ? 'primary' : 'outline'}
          onClick={() => setLoginMethod('password')}
          disabled={loading || otpLoading}
        >
          Login with Password
        </Button>
        <Button 
          variant={loginMethod === 'otp' ? 'primary' : 'outline'}
          onClick={() => {
            setLoginMethod('otp');
            setError(null); // Clear password error when switching
          }}
          disabled={loading || otpLoading}
        >
          Login with OTP
        </Button>
      </div>

      {loginMethod === 'password' ? (
        <form onSubmit={handleLogin}>
          <Input
            label="Username (Email)"
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
            Login
          </Button>
        </form>
      ) : (
        <form onSubmit={handleOtpLogin}>
          <Input
            label="Email or Phone Number"
            type="text" // Can be email or tel, using text for flexibility
            name="otpIdentifier"
            placeholder="your@email.com or +91XXXXXXXXXX"
            value={otpIdentifier}
            onChange={(e) => setOtpIdentifier(e.target.value)}
            required
            className="bg-deep-sea border-pristine-water text-pristine-water"
          />
          {!otpRequested ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full mt-4"
              onClick={handleRequestOtp}
              loading={otpLoading}
              disabled={!otpIdentifier || resendCooldown > 0}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Request OTP'}
            </Button>
          ) : (
            <>
              <Input
                label="OTP"
                type="text"
                name="otpCode"
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                className="bg-deep-sea border-pristine-water text-pristine-water mt-4"
                maxLength={6}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                {otpTimer > 0 ? (
                  <span>OTP expires in {Math.floor(otpTimer / 60)}:{('0' + (otpTimer % 60)).slice(-2)}</span>
                ) : (
                  <span>OTP expired.</span>
                )}
                {otpTimer === 0 && resendCooldown === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRequestOtp}
                    loading={otpLoading}
                    disabled={!otpIdentifier || otpLoading}
                    className="ml-4"
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full mt-6"
                loading={otpLoading}
                disabled={!otpIdentifier || !otpCode || otpTimer === 0}
              >
                Login with OTP
              </Button>
            </>
          )}
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-400">
          Don't have an account? {' '}
          <Link href="/register" className="text-coral-pop hover:underline">
            Register here
          </Link>
        </p>
        <p className="text-gray-400 mt-2">
          Forgot your password? {' '}
          <Link href="/forgot-password" className="text-coral-pop hover:underline">
            Reset it
          </Link>
        </p>
        <p className="text-gray-400 mt-4">
          For testing:
          <br/>Owner: <span className="font-bold">owner@aqua.com / password123</span>
          <br/>Admin: <span className="font-bold">admin@aqua.com / password123</span>
          <br/>Customer: <span className="font-bold">customer@aqua.com / password123</span>
          <br/>OTP Test: <span className="font-bold">test@otp.com (no password)</span>
        </p>
      </div>
    </div>
  );
}