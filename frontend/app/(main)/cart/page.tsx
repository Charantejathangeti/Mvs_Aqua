'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { CartItem, ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { USER_ID_COOKIE_NAME } from '@/constants';
import Cookies from 'js-cookie';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India', // Default to India as per problem description
    phoneNumber: '',
  });
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Mock loading cart items from local storage or context
    const storedCart = localStorage.getItem('mvs_aqua_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      // Seed with some mock data if cart is empty for demonstration
      setCartItems([
        { productId: 'prod-001', name: 'Blue Tang', price: 2500, quantity: 1 },
        { productId: 'prod-002', name: 'Soft Coral Frag', price: 800, quantity: 2 },
      ]);
    }

    const currentUserId = Cookies.get(USER_ID_COOKIE_NAME);
    setUserId(currentUserId);
  }, []);

  useEffect(() => {
    // Save cart to local storage whenever it changes
    localStorage.setItem('mvs_aqua_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!userId) {
      alert('Please login to proceed with checkout.');
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Basic validation for shipping address
    if (
      !shippingAddress.fullName ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.zipCode ||
      !shippingAddress.phoneNumber
    ) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    setIsCheckoutLoading(true);

    // In a real application, you would send this order data to your backend
    // and then redirect to the WhatsApp success page with order details.
    // For this demonstration, we'll simulate an order and redirect.

    const orderData = {
      userId,
      items: cartItems,
      shippingAddress,
      totalAmount: calculateTotal(),
      // status: 'PENDING' - assumed by backend
    };

    // Store order data in session storage to pass to success page
    sessionStorage.setItem('mvs_aqua_current_order', JSON.stringify(orderData));

    router.push('/cart/checkout/success');
  };

  return (
    <div className="min-h-screen bg-deep-sea text-pristine-water p-4 md:p-8">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-10 text-center">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-abyssal rounded-lg shadow-lg">
          <p className="text-xl mb-6">Your cart is currently empty.</p>
          <Link href="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-abyssal rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-montserrat font-semibold text-pristine-water mb-6 border-b border-deep-sea pb-4">Items</h2>
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between border-b border-deep-sea py-4 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <Image
                    src={`https://picsum.photos/80/80?random=${item.productId.split('-')[1]}`} // Placeholder image
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-coral-pop">{item.name}</h3>
                    <p className="text-pristine-water">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                    className="w-20 text-center bg-deep-sea border-deep-sea text-pristine-water"
                  />
                  <span className="text-xl font-bold text-pristine-water">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <Button variant="danger" size="sm" onClick={() => removeItem(item.productId)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-6 flex justify-end items-center text-2xl font-bold text-pristine-water">
              Subtotal: <span className="text-coral-pop ml-2">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address and Checkout Summary */}
          <div className="lg:col-span-1 bg-abyssal rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-montserrat font-semibold text-pristine-water mb-6 border-b border-deep-sea pb-4">Shipping Address</h2>
            <form className="mb-8">
              <Input
                label="Full Name"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleAddressChange}
                required
              />
              <Input
                label="Address Line 1"
                name="addressLine1"
                value={shippingAddress.addressLine1}
                onChange={handleAddressChange}
                required
              />
              <Input
                label="Address Line 2 (Optional)"
                name="addressLine2"
                value={shippingAddress.addressLine2 || ''}
                onChange={handleAddressChange}
              />
              <Input
                label="City"
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                required
              />
              <Input
                label="State"
                name="state"
                value={shippingAddress.state}
                onChange={handleAddressChange}
                required
              />
              <Input
                label="Zip Code"
                name="zipCode"
                value={shippingAddress.zipCode}
                onChange={handleAddressChange}
                required
              />
              <Input
                label="Country"
                name="country"
                value={shippingAddress.country}
                onChange={handleAddressChange}
                required
                readOnly // Assuming country is fixed to India as per spec
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={shippingAddress.phoneNumber}
                onChange={handleAddressChange}
                required
                type="tel"
              />
            </form>

            <h2 className="text-2xl font-montserrat font-semibold text-pristine-water mb-6 border-b border-deep-sea pb-4">Order Summary</h2>
            <div className="flex justify-between items-center text-xl mb-4">
              <span>Items Total:</span>
              <span className="font-bold text-coral-pop">₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl mb-6">
              <span>Shipping:</span>
              <span className="font-bold text-pristine-water">FREE</span> {/* Assuming free shipping for simplicity */}
            </div>
            <div className="flex justify-between items-center text-3xl font-bold text-pristine-water border-t border-deep-sea pt-4">
              <span>Total:</span>
              <span className="text-coral-pop">₹{calculateTotal().toFixed(2)}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-8"
              onClick={handleCheckout}
              loading={isCheckoutLoading}
              disabled={cartItems.length === 0}
            >
              Proceed to WhatsApp Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
