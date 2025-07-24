"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navRef = useRef(null);

  // Close mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-orange-200 dark:border-orange-800 sticky top-0 z-[70] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-playfair text-xl font-bold text-gray-900 dark:text-white">
              Temple<span className="text-orange-600">Quest</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/temple"
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Temple Search
              </Link>
              <Link
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/festivals"
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Festivals
              </Link>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/40 z-40 animate-in fade-in duration-200" 
              style={{top: '64px'}}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Content */}
            <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 backdrop-blur-lg border-t border-orange-200 dark:border-orange-800 shadow-2xl z-[60] animate-in slide-in-from-top-2 duration-200">
            <div className="py-6 px-4 sm:px-6">
              <div className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="group flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-1">Discover</span>
                  <div className="w-0 group-hover:w-2 h-2 bg-orange-500 rounded-full transition-all duration-200"></div>
                </Link>
                <Link
                  href="/temple"
                  className="group flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-1">Temple Search</span>
                  <div className="w-0 group-hover:w-2 h-2 bg-orange-500 rounded-full transition-all duration-200"></div>
                </Link>
                <Link
                  href="/festivals"
                  className="group flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-1">Festivals</span>
                  <div className="w-0 group-hover:w-2 h-2 bg-orange-500 rounded-full transition-all duration-200"></div>
                </Link>
                <Link
                  href="/about"
                  className="group flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200 ease-in-out"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-1">About</span>
                  <div className="w-0 group-hover:w-2 h-2 bg-orange-500 rounded-full transition-all duration-200"></div>
                </Link>
              </div>
              
              {/* Decorative bottom border */}
              <div className="mt-6 pt-4 border-t border-orange-100 dark:border-orange-800/50">
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </nav>
  );
}
