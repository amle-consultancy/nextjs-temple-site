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
export default function About() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] mb-12 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800/70 to-orange-700/70 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1612438214708-f428a707dd4e?fm=jpg&q=60&w=3000"
            alt="Indian Temples"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-center p-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover India's Sacred Temples
            </h1>
            <p className="text-xl text-white max-w-3xl">
              Exploring the spiritual heritage and architectural marvels of
              ancient India
            </p>
          </div>
        </div>

        {/* About Our Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
          <div className="max-w-6xl mx-auto text-lg">
            <p className="mb-4 text-justify">
              Welcome to the Temple Discovery Site, your comprehensive guide to
              India's sacred temples. Our mission is to document, preserve, and
              share the rich cultural and spiritual heritage of India's temple
              architecture with the world.
            </p>
            <p className="mb-4">
              India is home to thousands of temples spanning various
              architectural styles, historical periods, and religious
              traditions. From the towering Dravidian temples of Tamil Nadu to
              the intricate stone carvings of Khajuraho, each temple tells a
              unique story of faith, artistry, and history.
            </p>
            <p>
              Through detailed information, stunning imagery, and cultural
              context, we aim to make these sacred spaces accessible to
              everyone—whether you're planning a pilgrimage, researching
              architectural history, or simply curious about India's spiritual
              landmarks.
            </p>
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Explore Temple Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h3 className="text-xl font-semibold mb-3">
                By Architectural Style
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dravidian Temples of South India</li>
                <li>Nagara Temples of North India</li>
                <li>Vesara Temples of Central India</li>
                <li>Cave Temples</li>
                <li>Modern Temple Architecture</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h3 className="text-xl font-semibold mb-3">
                By Religious Significance
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Jyotirlinga Temples (Shiva)</li>
                <li>Shakti Peethas (Divine Mother)</li>
                <li>Divya Desams (Vishnu)</li>
                <li>Ashtavinayak Temples (Ganesha)</li>
                <li>Panch Kedar Temples</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h3 className="text-xl font-semibold mb-3">
                By Historical Period
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ancient Temples (Pre-5th century)</li>
                <li>Early Medieval Temples (5th-10th century)</li>
                <li>Medieval Temples (11th-16th century)</li>
                <li>Late Medieval Temples (17th-19th century)</li>
                <li>Modern Temples (20th century onwards)</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h3 className="text-xl font-semibold mb-3">
                By Geographic Region
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>South Indian Temples</li>
                <li>North Indian Temples</li>
                <li>East Indian Temples</li>
                <li>West Indian Temples</li>
                <li>Himalayan Temples</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Featured Temple Regions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Temple Regions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1675677044118-3fd84f9deaf0?fm=jpg&q=60&w=3000"
                  alt="Tamil Nadu Temples"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Tamil Nadu</CardTitle>
                <CardDescription>
                  Home to magnificent Dravidian temples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Tamil Nadu houses some of India's most spectacular temple
                  architecture, including the Brihadeeswara Temple in Thanjavur
                  and the Meenakshi Amman Temple in Madurai.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1706790574525-d218c4c52b5c?fm=jpg&q=60&w=3000"
                  alt="Odisha Temples"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Odisha</CardTitle>
                <CardDescription>
                  Renowned for Kalinga architecture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Odisha's temples, including the famous Jagannath Temple in
                  Puri and the Sun Temple at Konark, showcase the distinctive
                  Kalinga architectural style.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1612438214708-f428a707dd4e?fm=jpg&q=60&w=3000"
                  alt="Uttarakhand Temples"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Uttarakhand</CardTitle>
                <CardDescription>
                  Sacred Himalayan temple destinations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  The Himalayan state of Uttarakhand is home to the Char Dham
                  pilgrimage circuit, including the ancient Kedarnath and
                  Badrinath temples nestled in the mountains.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Our Community */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-8 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Temple Discovery Community
          </h2>
          <p className="text-lg mb-6 max-w-3xl mx-auto">
            Connect with fellow temple enthusiasts, share your experiences, and
            contribute to our growing database of India's sacred spaces.
            Together, we can preserve and celebrate India's magnificent temple
            heritage.
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            <Link href="/temple" className="block w-full h-full">
              Explore Temples
            </Link>
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
