import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MapPin, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-white" />
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Exists
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              The sacred path you're looking for seems to have vanished into the
              divine mist.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-800 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Let's Guide You Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Don't worry! There are many other sacred destinations waiting to
              be discovered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
              <Link href="/temple">
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Temples
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>
              "Every temple has its own story, every path its own destination."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
