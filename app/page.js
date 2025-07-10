
import HeroSection from "@/components/hero-section";
import TempleGrid from "@/components/temple-grid";
import FestivalsSection from "@/components/festivals-section";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { templesData } from "@/data/temples-data";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-12 xl:py-16">
        <TempleGrid temples={templesData} />
        <FestivalsSection />
      </div>
      <Footer />
    </div>
  );
}
