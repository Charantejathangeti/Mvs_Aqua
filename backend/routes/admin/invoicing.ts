import { Router, Request, Response } from 'express';
import { requireRole } from '../../middleware/auth';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { Order, CartItem, ShippingAddress } from '../../types';

const router = Router();

// Mock Database (in a real app, this would interact with a PostgreSQL database)
const mockOrders: Order[] = [];
let orderIdCounter = 1;

// Seed some mock data if needed for testing
mockOrders.push({
  id: `ORD-${orderIdCounter++}`,
  userId: 'usr-customer-001',
  items: [
    { productId: 'prod-001', name: 'Blue Tang', price: 2500, quantity: 1 },
    { productId: 'prod-002', name: 'Coral Frag', price: 800, quantity: 2 },
  ],
  shippingAddress: {
    fullName: 'John Doe',
    addressLine1: '123 Ocean Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
    phoneNumber: '+919876543210',
  },
  totalAmount: 2500 + (800 * 2),
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
});
mockOrders.push({
  id: `ORD-${orderIdCounter++}`,
  userId: 'usr-customer-002',
  items: [
    { productId: 'prod-003', name: 'Clownfish Pair', price: 3000, quantity: 1 },
  ],
  shippingAddress: {
    fullName: 'Jane Smith',
    addressLine1: '456 Reef Lane',
    city: 'Delhi',
    state: 'Delhi',
    zipCode: '110001',
    country: 'India',
    phoneNumber: '+919988776655',
  },
  totalAmount: 3000,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
});


/**
 * @route GET /api/admin/invoicing/orders
 * @description Get all orders (for admin dashboard view).
 * Protected by 'OWNER' or 'ADMIN' role.
 */
router.get('/orders', requireRole(['OWNER', 'ADMIN']), (req: Request, res: Response) => {
  res.status(200).json(mockOrders);
});

/**
 * @route POST /api/admin/invoicing/order/confirm
 * @description Confirm an order, update its status, and generate dual invoices.
 * Protected by 'OWNER' or 'ADMIN' role.
 */
router.post('/order/confirm', requireRole(['OWNER', 'ADMIN']), async (req: Request, res: Response) => {
  const { orderId, confirmationName } = req.body; // confirmationName is the name of the admin/owner confirming

  if (!orderId || !confirmationName) {
    return res.status(400).json({ message: 'Order ID and confirmation name are required.' });
  }

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  const order = mockOrders[orderIndex];

  if (order.status === 'CONFIRMED') {
    return res.status(400).json({ message: 'Order already confirmed.' });
  }

  // Simulate Database Update
  order.status = 'CONFIRMED';
  order.confirmedBy = confirmationName;
  order.updatedAt = new Date();
  mockOrders[orderIndex] = order; // Update the mock order

  try {
    const invoiceDate = new Date();
    const clientInvoicePath = await generateInvoice({
      orderId: order.id,
      customerName: order.shippingAddress.fullName,
      customerAddress: order.shippingAddress,
      items: order.items,
      totalAmount: order.totalAmount,
      confirmationName: confirmationName, // Only for audit, client invoice might not show this
      invoiceDate: invoiceDate,
      type: 'CLIENT',
    });

    const auditInvoicePath = await generateInvoice({
      orderId: order.id,
      customerName: order.shippingAddress.fullName,
      customerAddress: order.shippingAddress,
      items: order.items,
      totalAmount: order.totalAmount,
      confirmationName: confirmationName,
      invoiceDate: invoiceDate,
      type: 'AUDIT',
    });

    res.status(200).json({
      message: `Order ${orderId} confirmed successfully.`,
      order,
      clientInvoiceUrl: clientInvoicePath,
      auditInvoiceUrl: auditInvoicePath,
    });

  } catch (error) {
    console.error('Error generating invoices:', error);
    // Revert status if invoice generation fails (optional, depending on business logic)
    order.status = 'PENDING';
    order.confirmedBy = undefined;
    order.updatedAt = new Date();
    mockOrders[orderIndex] = order;
    res.status(500).json({ message: 'Failed to generate invoices.', error: error.message });
  }
});

export default router;
