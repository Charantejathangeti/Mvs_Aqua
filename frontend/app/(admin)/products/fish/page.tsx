'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Product } from '@/types';

// Mock product data (in a real app, this would be fetched from the backend)
const initialProducts: Product[] = [
  { id: 'prod-001', name: 'Blue Tang', price: 2500, stock: 10, imageUrl: 'https://picsum.photos/100/100?random=1', description: 'Vibrant and peaceful blue tang.' },
  { id: 'prod-002', name: 'Coral Frag (SPS)', price: 800, stock: 25, imageUrl: 'https://picsum.photos/100/100?random=2', description: 'Easy-to-care-for soft coral.' },
  { id: 'prod-003', name: 'Clownfish Pair', price: 3000, stock: 5, imageUrl: 'https://picsum.photos/100/100?random=3', description: 'Iconic and playful pair of clownfish.' },
  { id: 'prod-004', name: 'Royal Gramma', price: 1200, stock: 15, imageUrl: 'https://picsum.photos/100/100?random=4', description: 'Stunning purple and yellow fish.' },
  { id: 'prod-005', name: 'Fire Shrimp', price: 700, stock: 20, imageUrl: 'https://picsum.photos/100/100?random=5', description: 'Beautiful and active cleaner shrimp.' },
];

export default function LiveFishManagementPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditPrice(product.price);
    setEditStock(product.stock);
  };

  const handleSave = async (productId: string) => {
    setIsSaving(true);
    // Simulate API call to update product
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, price: editPrice, stock: editStock } : product
      )
    );
    setEditingProductId(null);
    setIsSaving(false);
    console.log(`Product ${productId} updated: Price ${editPrice}, Stock ${editStock}`);
    // In a real app, you'd send an axios.put to your backend here
  };

  const handleCancel = () => {
    setEditingProductId(null);
  };

  const handleImageUpdate = (productId: string) => {
    // Placeholder for image update logic
    alert(`Image update for product ${productId} would be handled here.`);
    console.log(`Initiating image update for ${productId}`);
  };

  return (
    <div className="p-4 md:p-6 bg-deep-sea rounded-lg shadow-lg">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-8">Live Fish Inventory</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-abyssal rounded-lg shadow-md">
          <thead className="bg-deep-sea text-pristine-water">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Price (₹)</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-deep-sea hover:bg-deep-sea transition-colors duration-200">
                <td className="py-4 px-4">
                  <Image src={product.imageUrl} alt={product.name} width={60} height={60} className="rounded-md object-cover" />
                </td>
                <td className="py-4 px-4 text-pristine-water font-semibold">{product.name}</td>
                <td className="py-4 px-4">
                  {editingProductId === product.id ? (
                    <Input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                      className="w-28 text-center bg-pristine-water text-deep-sea"
                    />
                  ) : (
                    <span className="text-pristine-water">₹{product.price.toFixed(2)}</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {editingProductId === product.id ? (
                    <Input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(parseInt(e.target.value))}
                      className="w-24 text-center bg-pristine-water text-deep-sea"
                    />
                  ) : (
                    <span className="text-pristine-water">{product.stock}</span>
                  )}
                </td>
                <td className="py-4 px-4 space-x-2 flex items-center">
                  {editingProductId === product.id ? (
                    <>
                      <Button variant="primary" size="sm" onClick={() => handleSave(product.id)} loading={isSaving}>
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleImageUpdate(product.id)}>
                        Update Image
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Button variant="primary" size="lg">Add New Fish</Button>
      </div>
    </div>
  );
}
