import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function TagsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-amber-950 dark:to-orange-950">
      <Navbar />
      
      {/* Header Section Skeleton */}
      <div className="bg-gradient-to-r from-amber-800/90 to-orange-600/90 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Skeleton className="w-8 h-8 mr-3 bg-white/20" />
              <Skeleton className="h-10 w-64 bg-white/20" />
            </div>
            <Skeleton className="h-6 w-48 mx-auto bg-white/20" />
            <div className="mt-4">
              <Skeleton className="h-6 w-32 mx-auto bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[...Array(15)].map((_, index) => (
              <Card key={index} className="overflow-hidden bg-white/80 dark:bg-gray-800/80">
                <Skeleton className="h-48 w-full" />
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-8 w-24" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination Skeleton */}
          <div className="flex justify-center items-center space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}