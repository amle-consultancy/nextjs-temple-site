"use client";

import Image from "next/image";
import {
  MapPin,
  Clock,
  Calendar,
  Star,
  Navigation,
  Phone,
  Globe,
  Users,
  History,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TempleProfile({ temple }) {
  // Function to handle opening Google Maps
  const handleGetDirections = () => {
    if (temple.mapsLink) {
      window.open(temple.mapsLink, "_blank");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8 lg:py-10 xl:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[28rem] rounded-2xl overflow-hidden">
            <Image
              src={temple.image || "/static/images/temple-placeholder.jpg"}
              alt={temple.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <h1 className="font-playfair text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                {temple.name}
              </h1>
              <div className="flex items-center text-white/90">
                <MapPin className="w-5 h-5 mr-2" />
                <span>
                  {temple.location?.city || ""}
                  {temple.location?.district
                    ? `, ${temple.location.district}`
                    : ""}
                  {temple.location?.state ? `, ${temple.location.state}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Combined Content */}
          <Card>
            <CardContent className="space-y-6 mt-6 sm:space-y-8 lg:space-y-10">
              {/* About Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About This Temple
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {temple.about ||
                    "Information about this temple will be added soon."}
                </p>
              </div>

              {/* Temple Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Temple Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-orange-600" />
                      Primary Deity
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {temple.deity || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Landmark className="w-4 h-4 mr-2 text-orange-600" />
                      Architecture Style
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {temple.architecture || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-orange-600" />
                      Construction Period
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {temple.constructionPeriod || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <History className="w-4 h-4 mr-2 text-orange-600" />
                      Built By
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {temple.builtBy || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Historical Significance */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Historical Significance
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {temple.significance ||
                    "Information about historical significance will be added soon."}
                </p>
              </div>

              {/* Major Festivals */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Major Festivals
                </h3>
                <div className="space-y-4">
                  {Array.isArray(temple.festivals) &&
                  temple.festivals.length > 0 ? (
                    temple.festivals.map((festival, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-orange-500 pl-4 sm:pl-6 bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-r-lg"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {festival.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {festival.period}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {festival.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="border-l-4 border-orange-500 pl-4 sm:pl-6 bg-orange-50 dark:bg-orange-900/20 p-4 sm:p-6 rounded-r-lg">
                      <p className="text-gray-700 dark:text-gray-300">
                        Information about festivals will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Location
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {temple.location?.city || ""}
                    {temple.location?.district
                      ? `, ${temple.location.district}`
                      : ""}
                    {temple.location?.state ? `, ${temple.location.state}` : ""}
                    {temple.location?.pincode
                      ? ` - ${temple.location.pincode}`
                      : ""}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Deity
                  </h4>
                  <Link href={`/temple/tags?deity=${temple.deity}`}>
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                    >
                      {temple.deity || "Not specified"}
                    </Badge>
                  </Link>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Architecture
                  </h4>
                  <Link href={`/temple/tags?architecture=${temple.architecture}`}>
                    <Badge
                      variant="outline"
                      className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
                    >
                      {temple.architecture || "Not specified"}
                    </Badge>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 text-orange-600 mr-2" />
                Visit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {temple.mapsLink && (
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              )}

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center mt-2">
                  Plan your visit in advance and check local guidelines
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(temple.contact?.phone || temple.contact?.website) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 text-orange-600 mr-2" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {temple.contact?.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {temple.contact.phone}
                    </span>
                  </div>
                )}
                {temple.contact?.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <a
                      href={temple.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                    >
                      Official Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Back to Search */}
          <div className="mt-8">
            <Link href="/temple">
              <Button
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/50"
              >
                Back to Temple Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
