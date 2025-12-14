import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, JwtPayload } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables.');
  // Fix: Add type assertion to bypass TypeScript if NodeJS.Process is not correctly resolved.
  (process as any).exit(1);
}

// Extend the Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to require a specific role(s) for access.
 */
export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
      req.user = decoded; // Attach user payload to the request

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient role.' });
      }

      next(); // User has required role, proceed to the next middleware/route handler
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };
};

/**
 * Middleware for frontend to remotely verify role.
 * This is called by Next.js middleware.ts.
 */
export const verifyRoleMiddleware = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ isAuthenticated: false, message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    // For this endpoint, we just return the role and authentication status
    res.status(200).json({ isAuthenticated: true, role: decoded.role, userId: decoded.userId, username: decoded.username });
  } catch (error) {
    console.error('JWT verification failed for /verify-role:', error);
    res.status(401).json({ isAuthenticated: false, message: 'Invalid token.' });
  }
};