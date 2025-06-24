import Navbar from '@/components/navbar';
import TempleProfile from '@/components/temple-profile';
import Footer from '@/components/footer';
import { templesData } from '@/data/temples-data';
import { notFound } from 'next/navigation';

// Generate static params for all temple IDs
export async function generateStaticParams() {
  return templesData.map((temple) => ({
    id: temple.id.toString(),
  }));
}

export default function TempleDetailPage({ params }) {
  const temple = templesData.find(t => t.id === parseInt(params.id));

  if (!temple) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      <TempleProfile temple={temple} />
      <Footer />
    </div>
  );
}