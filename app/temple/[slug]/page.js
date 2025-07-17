"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import Navbar from '@/components/navbar';
import TempleProfile from '@/components/temple-profile';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

export default function TempleDetailPage({ params }) {
  // Unwrap params using use(params) for Next.js dynamic route
  const resolvedParams = use(params);
  const templeSlug = useMemo(() => resolvedParams.slug, [resolvedParams]);

  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scalable, abortable fetch function
  const fetchTemple = useCallback(async (slug, signal) => {
    const res = await fetch(`/api/places/${slug}`, { signal });
    if (!res.ok) throw new Error('Failed to fetch temple');
    const data = await res.json();
    if (data && data.success && data.data) return data.data;
    return null;
  }, []);

  // Optimized effect for large user base (abort on fast navigation)
  useEffect(() => {
    if (!templeSlug) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchTemple(templeSlug, controller.signal)
      .then(data => {
        setTemple(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setTemple(null);
          setError(err.message || 'Unknown error');
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [templeSlug, fetchTemple]);

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
        <Navbar />
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">Retry</button>
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