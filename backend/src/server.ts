import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import adminInvoicingRoutes from './routes/admin/invoicing';
import path from 'path';
// Fix: Import `fileURLToPath` and `dirname` for ES module compatibility with __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Fix: Derive __dirname for ES Modules compatibility, as it might not be globally available depending on TypeScript/Node.js module configuration.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000'], // Allow requests from your Next.js frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/invoicing', adminInvoicingRoutes);

// Serve static files for generated invoices
app.use('/invoices', express.static(path.join(__dirname, '../invoices')));

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});