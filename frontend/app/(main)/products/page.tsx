import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import { Product } from '@/types';

// Mock product data (in a real app, this would come from an API)
const mockProducts: Product[] = [
  { id: 'prod-001', name: 'Blue Tang', price: 2500, stock: 10, imageUrl: 'https://picsum.photos/400/300?random=1', description: 'A vibrant and peaceful fish, perfect for a reef tank.' },
  { id: 'prod-002', name: 'Soft Coral Frag', price: 800, stock: 25, imageUrl: 'https://picsum.photos/400/300?random=2', description: 'Easy-to-care-for soft coral, adds beauty to any aquarium.' },
  { id: 'prod-003', name: 'Clownfish Pair', price: 3000, stock: 5, imageUrl: 'https://picsum.photos/400/300?random=3', description: 'Iconic and playful pair, known for their symbiotic relationship.' },
  { id: 'prod-004', name: 'Anemone', price: 1800, stock: 8, imageUrl: 'https://picsum.photos/400/300?random=4', description: 'A beautiful host for clownfish, requires specific care.' },
  { id: 'prod-005', name: 'Tiger Shrimp', price: 350, stock: 30, imageUrl: 'https://picsum.photos/400/300?random=5', description: 'Excellent cleanup crew member for your tank.' },
  { id: 'prod-006', name: 'Reef Rock (per kg)', price: 600, stock: 100, imageUrl: 'https://picsum.photos/400/300?random=6', description: 'Natural and porous rock for aquascaping and filtration.' },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-deep-sea text-pristine-water p-4">
      <h1 className="text-4xl font-montserrat font-bold text-coral-pop mb-10 text-center">Our Aquatic Collection</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mockProducts.map((product) => (
          <div key={product.id} className="bg-abyssal rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-montserrat font-semibold text-pristine-water mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mb-3">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-coral-pop">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
                </span>
              </div>
              <Button disabled={product.stock === 0} className="w-full">
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
