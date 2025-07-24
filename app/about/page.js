import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ExternalLink } from "lucide-react";
export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Hero Section */}
        <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] mb-8 sm:mb-10 md:mb-12 rounded-lg sm:rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800/70 to-orange-700/70 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1612438214708-f428a707dd4e?fm=jpg&q=60&w=3000"
            alt="Indian Temples"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-center p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Discover India's Sacred Temples
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white max-w-xs sm:max-w-2xl md:max-w-3xl leading-relaxed">
              Exploring the spiritual heritage and architectural marvels of
              ancient India
            </p>
          </div>
        </div>

        {/* About Our Mission */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-white">Our Mission</h2>
          <div className="max-w-6xl mx-auto text-base sm:text-lg text-gray-700 dark:text-gray-300">
            <p className="mb-3 sm:mb-4 text-left sm:text-justify leading-relaxed">
              Welcome to the Temple Discovery Site, your comprehensive guide to
              India's sacred temples. Our mission is to document, preserve, and
              share the rich cultural and spiritual heritage of India's temple
              architecture with the world.
            </p>
            <p className="mb-3 sm:mb-4 leading-relaxed">
              India is home to thousands of temples spanning various
              architectural styles, historical periods, and religious
              traditions. From the towering Dravidian temples of Tamil Nadu to
              the intricate stone carvings of Khajuraho, each temple tells a
              unique story of faith, artistry, and history.
            </p>
            <p className="leading-relaxed">
              Through detailed information, stunning imagery, and cultural
              context, we aim to make these sacred spaces accessible to
              everyone—whether you're planning a pilgrimage, researching
              architectural history, or simply curious about India's spiritual
              landmarks.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Temple Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Access detailed information about hundreds of temples across
                  India, including their history, architectural style, religious
                  significance, and practical visitor information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Understand the cultural, historical, and religious context of
                  each temple, including the deities worshipped, festivals
                  celebrated, and local traditions associated with each site.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visual Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Explore high-quality images showcasing the architectural
                  details, sculptures, and artistic elements that make each
                  temple unique and visually stunning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Find practical information for temple visits, including
                  opening hours, entry fees, dress codes, special ceremonies,
                  and nearby accommodations to plan your journey.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Exploration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Discover temples by region, architectural style, historical
                  period, or religious significance to create personalized
                  temple trails across India.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Festival Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Stay updated on major temple festivals and celebrations
                  throughout the year, with information on rituals, processions,
                  and cultural events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Temple Categories */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">
            Explore Temple Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-amber-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-amber-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                By Historical Period
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <li>Ancient Temples (Pre-5th century)</li>
                <li>Early Medieval Temples (5th-10th century)</li>
                <li>Medieval Temples (11th-16th century)</li>
                <li>Late Medieval Temples (17th-19th century)</li>
                <li>Modern Temples (20th century onwards)</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-amber-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                By Religious Significance
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <li>Jyotirlinga Temples (Shiva)</li>
                <li>Shakti Peethas (Divine Mother)</li>
                <li>Divya Desams (Vishnu)</li>
                <li>Ashtavinayak Temples (Ganesha)</li>
                <li>Panch Kedar Temples</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-amber-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                By Architectural Style
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                <Link href="/temple/query?architecture=dravidian">
                  <li className="flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>Dravidian Temples of South India</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
                <Link href="/temple/query?architecture=nagara">
                  <li className="flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>Nagara Temples of North India</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
                <Link href="/temple/query?architecture=vesara">
                  <li className="flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>Vesara Temples of Central India</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
                <Link href="/temple/query?architecture=hoysala">
                  <li className="flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>Hoysala Temples of India</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-amber-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                By Geographic Region
              </h3>
              <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                <Link href="/temple/query?region=south">
                  <li className="my-1 flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>South Indian Temples</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
                <Link href="/temple/query?region=north">
                  <li className="my-1 flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>North Indian Temples</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
                <Link href="/temple/query?region=east">
                  <li className="my-1 flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>East Indian Temples</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
                <Link href="/temple/query?region=west">
                  <li className="my-1 flex items-center justify-between hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm sm:text-base text-gray-700 dark:text-gray-300 py-1">
                    <span>West Indian Temples</span>
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>

        {/* Featured Temple Regions */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">
            Featured Temple Regions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="overflow-hidden">
              <div className="relative h-40 sm:h-48">
                <Image
                  src="https://images.unsplash.com/photo-1675677044118-3fd84f9deaf0?fm=jpg&q=60&w=3000"
                  alt="Tamil Nadu Temples"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Tamil Nadu</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Home to magnificent Dravidian temples
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base leading-relaxed">
                  Tamil Nadu houses some of India's most spectacular temple
                  architecture, including the Brihadeeswara Temple in Thanjavur
                  and the Meenakshi Amman Temple in Madurai.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-40 sm:h-48">
                <Image
                  src="https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?fm=jpg&q=60&w=3000"
                  alt="Odisha Temples"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Odisha</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Renowned for Kalinga architecture
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base leading-relaxed">
                  Odisha's temples, including the famous Jagannath Temple in
                  Puri and the Sun Temple at Konark, showcase the distinctive
                  Kalinga architectural style.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-40 sm:h-48">
                <Image
                  src="https://images.unsplash.com/photo-1612438214708-f428a707dd4e?fm=jpg&q=60&w=3000"
                  alt="Uttarakhand Temples"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Uttarakhand</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Sacred Himalayan temple destinations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-sm sm:text-base leading-relaxed">
                  The Himalayan state of Uttarakhand is home to the Char Dham
                  pilgrimage circuit, including the ancient Kedarnath and
                  Badrinath temples nestled in the mountains.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Our Community */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 p-6 sm:p-8 rounded-lg sm:rounded-xl text-center border dark:border-gray-600">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white leading-tight">
            Join Our Temple Discovery Community
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto text-gray-700 dark:text-gray-300 leading-relaxed">
            Connect with fellow temple enthusiasts, share your experiences, and
            contribute to our growing database of India's sacred spaces.
            Together, we can preserve and celebrate India's magnificent temple
            heritage.
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors text-sm sm:text-base">
            <Link href="/temple" className="block w-full h-full">
              Explore Temples
            </Link>
          </button>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
