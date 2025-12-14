export type Role = 'OWNER' | 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  username: string;
  role: Role;
  password?: string; // Only for mock users, should not be sent over wire
  otp?: string; // For mock OTP login
  otpExpiresAt?: Date; // For mock OTP login expiry
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  confirmedBy?: string; // Name of ADMIN/OWNER who confirmed
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: Role;
}

export interface InvoiceDetails {
  orderId: string;
  customerName: string;
  customerAddress: ShippingAddress;
  items: CartItem[];
  totalAmount: number;
  confirmationName: string;
  invoiceDate: Date;
  type: 'CLIENT' | 'AUDIT';
}