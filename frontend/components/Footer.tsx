import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-abyssal text-pristine-water py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <Link href="/about" className="hover:text-coral-pop transition-colors duration-200">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-coral-pop transition-colors duration-200">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-coral-pop transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-coral-pop transition-colors duration-200">
            Terms of Service
          </Link>
        </div>
        <div className="flex justify-center space-x-6 mb-6">
          {/* Social Media Icons - Use actual SVG or image components in a real app */}
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-pristine-water hover:text-coral-pop transition-colors duration-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C17.34 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-pristine-water hover:text-coral-pop transition-colors duration-200">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.002 3.714.051 1.104.067 1.791.217 2.601.545.74.3 1.28.82 1.742 1.282.46-.462.94-.757 1.282-1.742.328-.81.479-1.497.545-2.601.049-.93.051-1.284.051-3.714v-.006c0-2.43-.002-2.784-.051-3.714-.067-1.104-.217-1.791-.545-2.601-.3-.74-.82-1.282-1.282-1.742-.462-.46-.757-.94-1.742-1.282-.81-.328-1.497-.479-2.601-.545-.93-.049-1.284-.051-3.714-.051h-.006c-2.43 0-2.784.002-3.714.051-1.104.067-1.791.217-2.601.545-.74.3-1.28.82-1.742 1.282-.46.462-.94.757-1.282 1.742-.328.81-.479 1.497-.545 2.601-.049.93-.051 1.284-.051 3.714v.006c0 2.43.002 2.784.051 3.714.067 1.104.217 1.791.545 2.601.3.74.82 1.282 1.282 1.742.46.46.757.94 1.742 1.282.81.328 1.497.479 2.601.545.93.049 1.284.051 3.714.051h.006zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm0 0" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Mvs_Aqua. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
