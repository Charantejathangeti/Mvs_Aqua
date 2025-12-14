'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartItem, ShippingAddress } from '@/types';
import { WHATSAPP_OWNER_NUMBER } from '@/constants';
import Button from '@/components/Button';
import Link from 'next/link';

interface OrderData {
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('mvs_aqua_current_order');
    if (storedOrder) {
      const parsedOrder: OrderData = JSON.parse(storedOrder);
      setOrderData(parsedOrder);

      // Construct WhatsApp message
      const { items, shippingAddress, totalAmount } = parsedOrder;
      
      let message = `*New Order from Mvs_Aqua Customer*\n\n`;
      message += `*Order Details:*\n`;
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}\n`;
      });
      message += `*Total Amount:* ₹${totalAmount.toFixed(2)}\n\n`;
      
      message += `*Shipping Address:*\n`;
      message += `Name: ${shippingAddress.fullName}\n`;
      message += `Address: ${shippingAddress.addressLine1}`;
      if (shippingAddress.addressLine2) message += `, ${shippingAddress.addressLine2}`;
      message += `\nCity: ${shippingAddress.city}\n`;
      message += `State: ${shippingAddress.state}\n`;
      message += `Zip Code: ${shippingAddress.zipCode}\n`;
      message += `Country: ${shippingAddress.country}\n`;
      message += `Phone: ${shippingAddress.phoneNumber}\n\n`;
      message += `Please confirm this order and generate invoices.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_OWNER_NUMBER}?text=${encodedMessage}`;
      setWhatsappLink(whatsappUrl);
      
      // Clear the temporary order data from session storage after processing
      sessionStorage.removeItem('mvs_aqua_current_order');

      setLoading(false);
      // Automatically redirect after a short delay
      setTimeout(() => {
        window.location.href = whatsappUrl;
      }, 3000); // Redirect after 3 seconds
    } else {
      // If no order data, redirect back to cart or home
      router.replace('/cart');
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-deep-sea text-pristine-water p-4 text-center">
        <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-coral-pop mb-4 animate-pulse">
          Processing Your Order...
        </h1>
        <p className="text-lg md:text-xl mb-8">
          You are being redirected to WhatsApp to finalize your purchase.
        </p>
        <svg className="animate-spin h-10 w-10 text-pristine-water" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-deep-sea text-pristine-water p-4 text-center">
        <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-red-500 mb-4">
          Order Not Found
        </h1>
        <p className="text-lg md:text-xl mb-8">
          There was an issue retrieving your order details. Please try again.
        </p>
        <Link href="/cart">
          <Button variant="primary">Return to Cart</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-deep-sea text-pristine-water p-4 text-center">
      <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-seafoam-green mb-4">
        Checkout Initiated!
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Your order details have been sent to our team via WhatsApp for confirmation.
      </p>
      <p className="text-md md:text-lg mb-8 max-w-2xl">
        Please ensure you send the pre-filled message to our owner to finalize your order and receive your invoice.
      </p>
      <Button variant="primary" size="lg" className="bg-green-500 hover:bg-green-600 mb-6" onClick={() => window.open(whatsappLink, '_blank')}>
        Open WhatsApp Chat
      </Button>
      <Link href="/">
        <Button variant="secondary">Continue Shopping</Button>
      </Link>
    </div>
  );
}
