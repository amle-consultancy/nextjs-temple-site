"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import TempleProfile from '@/components/temple-profile';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

export default function TempleDetailPage({ params }) {
  // Unwrap params using use(params) for Next.js dynamic route
  const resolvedParams = use(params);
  const templeId = resolvedParams.id;

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (templeId) {
      setLoading(true);
      fetch(`/api/places/${templeId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.data) {
            setTemple(data.data);
          } else {
            setTemple(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setTemple(null);
          setLoading(false);
        });
    }
  }, [templeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-xl mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

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