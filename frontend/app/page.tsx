import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/Button';
import { WHATSAPP_OWNER_NUMBER } from '@/constants';

export default function Home() {
  const products = [
    { id: '1', name: 'Blue Tang', price: '₹2500', image: 'https://picsum.photos/400/300?random=1', description: 'Vibrant and peaceful blue tang.' },
    { id: '2', name: 'Coral Frag', price: '₹800', image: 'https://picsum.photos/400/300?random=2', description: 'Easy-to-care-for soft coral.' },
    { id: '3', name: 'Clownfish Pair', price: '₹3000', image: 'https://picsum.photos/400/300?random=3', description: 'Iconic and playful pair of clownfish.' },
  ];

  return (
    <div className="min-h-screen bg-deep-sea text-pristine-water">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/1920/1080?random=10)' }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 p-8 rounded-lg max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold text-white leading-tight mb-4 animate-fade-in">
            Dive into the World of Aquatic Wonders
          </h1>
          <p className="text-lg md:text-xl text-pristine-water mb-8 animate-slide-up">
            Mvs_Aqua brings you the finest selection of live fish, corals, and premium aquarium supplies.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="animate-bounce">
              Explore Our Collection
            </Button>
          </Link>
        </div>
      </section>

      {/* About Us/Intro Section */}
      <section className="py-16 bg-abyssal">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-coral-pop mb-6">
            Your Trusted Aquatic Partner
          </h2>
          <p className="text-lg leading-relaxed text-pristine-water">
            At Mvs_Aqua, we are passionate about aquatic life. We provide expert care, sustainable sourcing, and a white-glove service to ensure your aquatic habitat thrives. From rare species to essential equipment, we have everything you need to create a stunning underwater world.
          </p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-deep-sea">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-pristine-water text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-abyssal rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-semibold text-coral-pop mb-2">
                    {product.name}
                  </h3>
                  <p className="text-pristine-water mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pristine-water">
                      {product.price}
                    </span>
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="secondary" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-blue to-teal-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
            Need Expert Advice?
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Our team is here to help you create the perfect aquatic environment.
          </p>
          <Link
            href={`https://wa.me/${WHATSAPP_OWNER_NUMBER}?text=${encodeURIComponent('Hi Mvs_Aqua, I need some assistance with my aquarium.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg" className="bg-green-500 hover:bg-green-600">
              Chat with Us on WhatsApp
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}