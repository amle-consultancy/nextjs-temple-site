'use client';

import Link from 'next/link';
import { MapPin, Heart, Mail, Phone, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-10 lg:py-12 xl:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-playfair text-xl font-bold">
                Temple<span className="text-orange-400">Quest</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting souls with India's sacred heritage. Discover, explore, and experience the divine through our comprehensive temple directory.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for Indian culture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Discover</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/temples" className="text-gray-400 hover:text-orange-400 transition-colors">All Temples</Link></li>
              <li><Link href="/deities" className="text-gray-400 hover:text-orange-400 transition-colors">Browse by Deity</Link></li>
              <li><Link href="/states" className="text-gray-400 hover:text-orange-400 transition-colors">Browse by State</Link></li>
              <li><Link href="/architecture" className="text-gray-400 hover:text-orange-400 transition-colors">Architecture Styles</Link></li>
              <li><Link href="/festivals" className="text-gray-400 hover:text-orange-400 transition-colors">Festival Calendar</Link></li>
            </ul>
          </div>

          {/* Sacred Sites */}
          <div>
            <h3 className="font-semibold text-white mb-4">Sacred Sites</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jyotirlinga" className="text-gray-400 hover:text-orange-400 transition-colors">12 Jyotirlingas</Link></li>
              <li><Link href="/shakti-peeth" className="text-gray-400 hover:text-orange-400 transition-colors">51 Shakti Peethas</Link></li>
              <li><Link href="/char-dham" className="text-gray-400 hover:text-orange-400 transition-colors">Char Dham</Link></li>
              <li><Link href="/divya-desam" className="text-gray-400 hover:text-orange-400 transition-colors">108 Divya Desams</Link></li>
              <li><Link href="/pancha-bhoota" className="text-gray-400 hover:text-orange-400 transition-colors">Pancha Bhoota Sthalams</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400">info@templequest.in</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <span className="text-gray-400">www.templequest.in</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/contribute" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                Contribute a Temple →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 lg:pt-10 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 TempleQuest. Celebrating India's Sacred Heritage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}