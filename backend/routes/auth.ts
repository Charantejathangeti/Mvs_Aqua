import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, Role } from '../types';
import { verifyRoleMiddleware } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables.');
  // Fix: Add type assertion to bypass TypeScript if NodeJS.Process is not correctly resolved.
  (process as any).exit(1);
}

// Mock User Data (in a real app, this would come from a database)
const mockUsers: User[] = [
  { id: 'usr-owner-001', username: 'owner@aqua.com', password: 'password123', role: 'OWNER' },
  { id: 'usr-admin-001', username: 'admin@aqua.com', password: 'password123', role: 'ADMIN' },
  { id: 'usr-customer-001', username: 'customer@aqua.com', password: 'password123', role: 'CUSTOMER' },
  // Add a user for OTP testing
  { id: 'usr-otp-test', username: 'test@otp.com', role: 'CUSTOMER' }, // No password for OTP login initially
];

const OTP_EXPIRY_MINUTES = 5; // OTP valid for 5 minutes

/**
 * Helper to find user by username (email/phone)
 */
const findUserByIdentifier = (identifier: string) => {
  // In a real app, this would query a database and handle both email and phone number formats
  return mockUsers.find(u => u.username === identifier);
};

/**
 * @route POST /api/auth/register
 * @description Registers a new user with username (email) and password.
 */
router.post('/register', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if user already exists
  if (findUserByIdentifier(username)) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  const newUser: User = {
    id: `usr-${mockUsers.length + 1}-${Date.now()}`, // Simple unique ID
    username,
    password,
    role: 'CUSTOMER',
  };

  mockUsers.push(newUser);
  console.log(`New user registered: ${username}`);
  console.log('Current mockUsers:', mockUsers.map(u => ({ id: u.id, username: u.username, role: u.role })));


  res.status(201).json({ message: 'Registration successful. Please log in.' });
});

/**
 * @route POST /api/auth/login
 * @description User login and JWT generation using username/password.
 */
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = mockUsers.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET!,
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  res.status(200).json({ message: 'Login successful', token, role: user.role, userId: user.id, username: user.username });
});

/**
 * @route POST /api/auth/request-otp
 * @description Requests an OTP for a given username (email/phone).
 * MOCKS sending an OTP. In production, this would integrate with an SMS/email service.
 */
router.post('/request-otp', (req: Request, res: Response) => {
  const { username } = req.body; // Can be email or phone number

  const user = findUserByIdentifier(username);

  if (!user) {
    return res.status(404).json({ message: 'User not found with this identifier.' });
  }

  // Generate a mock 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000); // 5 minutes from now

  user.otp = otp;
  user.otpExpiresAt = otpExpiresAt;

  console.log(`MOCK OTP for ${username}: ${otp}. Expires at: ${otpExpiresAt.toLocaleString()}`); // Log OTP for testing

  res.status(200).json({ message: `OTP sent successfully to ${username} (mock).`, otp: otp }); // Return OTP for demo
});

/**
 * @route POST /api/auth/login-with-otp
 * @description Logs in a user using an OTP.
 */
router.post('/login-with-otp', (req: Request, res: Response) => {
  const { username, otp } = req.body;

  const user = findUserByIdentifier(username);

  if (!user || !user.otp || !user.otpExpiresAt) {
    return res.status(401).json({ message: 'Invalid request or OTP not generated.' });
  }

  if (user.otp !== otp) {
    return res.status(401).json({ message: 'Invalid OTP.' });
  }

  if (user.otpExpiresAt < new Date()) {
    // Clear expired OTP
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    return res.status(401).json({ message: 'OTP expired.' });
  }

  // OTP is valid and not expired, log in the user
  // Clear the OTP for single-use
  user.otp = undefined;
  user.otpExpiresAt = undefined;

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET!,
    { expiresIn: '1h' }
  );

  res.status(200).json({ message: 'Login successful via OTP', token, role: user.role, userId: user.id, username: user.username });
});


/**
 * @route GET /api/auth/verify-role
 * @description Endpoint for frontend middleware to verify token and get user role.
 */
router.get('/verify-role', verifyRoleMiddleware);

export default router;