"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  User,
  Building,
  Phone,
  Globe,
  ExternalLink,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TempleTagsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [tagInfo, setTagInfo] = useState({});

  const deity = searchParams.get("deity");
  const architecture = searchParams.get("architecture");
  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchTemples();
  }, [deity, architecture, page]);

  const fetchTemples = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate that we have either deity or architecture
      if (!deity && !architecture) {
        setError("Please provide either deity or architecture parameter");
        setLoading(false);
        return;
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (deity) queryParams.append("deity", deity);
      if (architecture) queryParams.append("architecture", architecture);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "15");

      const response = await fetch(
        `/api/temple/tags?${queryParams.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch temples");
      }

      if (data.success) {
        setTemples(data.data.temples);
        setPagination(data.data.pagination);
        setTagInfo(data.data.tag);
      } else {
        throw new Error(data.error || "Failed to fetch temples");
      }
    } catch (err) {
      console.error("Error fetching temples:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (deity) params.append("deity", deity);
    if (architecture) params.append("architecture", architecture);
    params.append("page", newPage.toString());

    router.push(`/temple/tags?${params.toString()}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
              <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">
                Error
              </h1>
              <p className="text-red-600 dark:text-red-300 mb-6">{error}</p>
              <Button
                onClick={() => router.push("/temple")}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Back to Temple Search
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6 md:px-12 md:py-12">
        <div className="max-w-7xl mx-auto">
          {!loading && temples.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Temple Directory
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Explore temples{" "}
                {tagInfo.type === "deity"
                  ? `dedicated to ${tagInfo.value}`
                  : `featuring ${tagInfo.value} architecture`}
              </p>
            </div>
          )}

          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(15)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : temples.length === 0 ? (
            // No Results
            <div className="text-center py-16">
              <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-12 max-w-lg mx-auto">
                <Building className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  No Temples Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                  No temples match the selected criteria for{" "}
                  {tagInfo.type === "deity" ? "deity" : "architectural style"}:{" "}
                  <span className="font-medium">{tagInfo.value}</span>
                </p>
                <Button
                  onClick={() => router.push("/temple")}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
                >
                  Browse All Temples
                </Button>
              </div>
            </div>
          ) : (
            // Temple Grid
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {temples.map((temple) => (
                  <Card
                    key={temple._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {temple.image ? (
                        <Image
                          src={temple.image}
                          alt={temple.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 flex items-center justify-center">
                          <Building className="w-16 h-16 text-amber-600 dark:text-amber-400" />
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                        {temple.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 text-xs font-medium">
                          Deity: {temple.deity}
                        </Badge>
                        {temple.architecture && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium">
                            Style: {temple.architecture}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-amber-600" />
                          <span>
                            {temple.location.city}, {temple.location.state}
                          </span>
                        </div>

                        {temple.builtBy && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-amber-600" />
                            <span className="line-clamp-1">
                              Built by {temple.builtBy}
                            </span>
                          </div>
                        )}

                        {temple.constructionPeriod && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                            <span>{temple.constructionPeriod}</span>
                          </div>
                        )}

                        {temple.about && (
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-3 mt-3">
                            {temple.about}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link href={`/temple/${temple._id}`}>
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            View Details
                          </Button>
                        </Link>

                        <div className="flex gap-2">
                          {temple.contact?.phone && (
                            <Button size="sm" variant="outline" className="p-2">
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                          {temple.contact?.website && (
                            <Button size="sm" variant="outline" className="p-2">
                              <Globe className="w-4 h-4" />
                            </Button>
                          )}
                          {temple.mapsLink && (
                            <Button size="sm" variant="outline" className="p-2">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                  </div>

                  <Button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    variant="outline"
                    className="flex items-center"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
