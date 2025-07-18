"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TempleCard from "@/components/temple-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function QueryPage() {
  const searchParams = useSearchParams();
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Extract query parameters
  const getQueryParams = () => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  // Fetch temples based on query parameters
  const fetchTemples = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = getQueryParams();
      const urlParams = new URLSearchParams({
        ...queryParams,
        page: page.toString(),
        limit: "12", // Show 12 temples per page
      });

      const response = await fetch(`/api/places/query?${urlParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch temples");
      }

      if (data.success) {
        setTemples(data.data);
        setPagination(data.pagination);
        setFilters(data.filters);
      } else {
        throw new Error(data.error || "Failed to fetch temples");
      }
    } catch (err) {
      setError(err.message);
      setTemples([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when search params change
  useEffect(() => {
    fetchTemples(currentPage);
  }, [searchParams, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Retry function
  const handleRetry = () => {
    fetchTemples(currentPage);
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== null) {
        activeFilters.push({ key, value });
      }
    });
    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 md:py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="text-left">
              <h1 className="font-playfair text-xl md:text-2xl font-bold mb-4">
                Temple Search Results
              </h1>
              <p className="text-sm md:text-base text-white/90">
                Discover temples based on your search criteria
              </p>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border-b border-orange-200 dark:border-orange-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-orange-600" />
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                  Active Filters:
                </span>
                {activeFilters.map(({ key, value }) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
          {/* Results Summary */}
          {!loading && !error && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Search className="w-4 h-4" />
                  <span>
                    Found {pagination.totalCount || 0} temples
                    {pagination.totalPages > 1 && (
                      <span className="ml-1">
                        (Page {pagination.currentPage} of{" "}
                        {pagination.totalPages})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <Alert className="max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleRetry}
                className="mt-4 bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && temples.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No temples found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search criteria or explore different
                  filters.
                </p>
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Go Back
                </Button>
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && temples.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {temples.map((temple) => (
                  <TempleCard key={temple._id} temple={temple} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                      (_, index) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={
                              currentPage === pageNum
                                ? "bg-orange-600 hover:bg-orange-700"
                                : "border-orange-200 text-orange-600 hover:bg-orange-50"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Results Summary Footer */}
              <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
                Showing {temples.length} of {pagination.totalCount} temples
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
