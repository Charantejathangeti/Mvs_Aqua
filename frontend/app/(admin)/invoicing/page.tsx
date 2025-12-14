'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_COOKIE_NAME } from '@/constants';
import Cookies from 'js-cookie';
import { Order } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';

type OrderFilterStatus = 'ALL' | 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function InvoicingPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]); // Store all fetched orders
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const [confirmationName, setConfirmationName] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<OrderFilterStatus>('ALL');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get(AUTH_TOKEN_COOKIE_NAME);
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.get<Order[]>(`${API_BASE_URL}/admin/invoicing/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllOrders(response.data);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (filterStatus === 'ALL') {
      return allOrders;
    }
    return allOrders.filter(order => order.status === filterStatus);
  }, [allOrders, filterStatus]);

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirmationName.trim()) {
      alert('Please enter your name for order confirmation.');
      return;
    }
    setConfirmingOrderId(orderId);
    setError(null);
    try {
      const token = Cookies.get(AUTH_TOKEN_COOKIE_NAME);
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post<{ message: string; order: Order; clientInvoiceUrl: string; auditInvoiceUrl: string }>(
        `${API_BASE_URL}/admin/invoicing/order/confirm`,
        { orderId, confirmationName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the local orders state with the confirmed order
      setAllOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: response.data.order.status,
                confirmedBy: response.data.order.confirmedBy,
                clientInvoiceUrl: response.data.clientInvoiceUrl,
                auditInvoiceUrl: response.data.auditInvoiceUrl,
                updatedAt: response.data.order.updatedAt,
              }
            : order
        )
      );
      // alert(response.data.message); // Comment out to avoid multiple alerts, can use toast/notification
      setConfirmationName(''); // Clear confirmation name after successful confirmation
    } catch (err: any) {
      console.error('Failed to confirm order:', err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred while confirming the order.');
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handleDownloadInvoice = async (url: string, filename: string) => {
    try {
      const fullUrl = `http://localhost:5000${url}`;
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center p-8 bg-abyssal rounded-lg shadow-lg">
        <p className="text-xl text-pristine-water">Loading orders...</p>
        <svg className="animate-spin h-8 w-8 text-coral-pop mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-abyssal rounded-lg shadow-lg">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <Button variant="primary" onClick={fetchOrders}>
          Reload Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-deep-sea rounded-lg shadow-lg">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-8">Invoicing Management</h1>

      <div className="mb-6 bg-abyssal p-4 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="flex-grow w-full md:w-auto">
          <Input
            label="Your Name for Confirmation"
            placeholder="Enter your name (Admin/Owner)"
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
            className="bg-deep-sea border-deep-sea text-pristine-water"
            id="confirmation-name-input"
          />
        </div>
        <div className="flex-shrink-0 w-full md:w-auto">
          <label htmlFor="order-status-filter" className="block text-pristine-water text-sm font-bold mb-2 md:mb-0">
            Filter by Status:
          </label>
          <select
            id="order-status-filter"
            className="block w-full md:w-auto p-2 border border-deep-sea rounded-md bg-deep-sea text-pristine-water focus:ring-coral-pop focus:border-coral-pop"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderFilterStatus)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-700 text-white p-3 rounded-md mb-4 text-center">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-abyssal rounded-lg shadow-md">
          <thead className="bg-deep-sea text-pristine-water">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Total (₹)</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Confirmed By</th>
              <th className="py-3 px-4 text-left">Actions</th>
              <th className="py-3 px-4 text-left">Invoices</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-pristine-water">No orders found matching the filter.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-deep-sea hover:bg-deep-sea transition-colors duration-200">
                  <td className="py-4 px-4 text-pristine-water">{order.id}</td>
                  <td className="py-4 px-4 text-pristine-water">{order.shippingAddress.fullName}</td>
                  <td className="py-4 px-4 text-pristine-water">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'PENDING'
                          ? 'bg-yellow-600 text-white'
                          : order.status === 'CONFIRMED'
                          ? 'bg-green-600 text-white'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-pristine-water">{order.confirmedBy || 'N/A'}</td>
                  <td className="py-4 px-4">
                    {order.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConfirmOrder(order.id)}
                        loading={confirmingOrderId === order.id}
                        disabled={!confirmationName.trim() || confirmingOrderId !== null}
                      >
                        {confirmingOrderId === order.id ? 'Confirming...' : 'Confirm Order'}
                      </Button>
                    )}
                  </td>
                  <td className="py-4 px-4 flex flex-col items-start space-y-2"> {/* Changed to flex-col for better layout */}
                    {order.clientInvoiceUrl && (
                      <>
                        <a
                          href={`http://localhost:5000${order.clientInvoiceUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ocean-blue hover:underline text-sm font-medium"
                        >
                          View Client
                        </a>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownloadInvoice(`http://localhost:5000${order.clientInvoiceUrl}`, `client_invoice_${order.id}.pdf`)}
                          className="mt-1" // Added margin for spacing
                        >
                          Download Client
                        </Button>
                      </>
                    )}
                    {order.auditInvoiceUrl && (
                      <a
                        href={`http://localhost:5000${order.auditInvoiceUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-seafoam-green hover:underline text-sm font-medium mt-2" // Added margin for spacing
                      >
                        View Audit
                      </a>
                    )}
                    {!order.clientInvoiceUrl && !order.auditInvoiceUrl && <span className="text-gray-400 text-sm">N/A</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}