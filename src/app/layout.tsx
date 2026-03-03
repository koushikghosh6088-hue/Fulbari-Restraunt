import type { Metadata } from "next";
import { Playfair_Display, Poppins, Hind_Siliguri } from "next/font/google";
import FloatingContact from "@/components/common/FloatingContact";
import { SmoothScrolling } from "@/components/common/SmoothScrolling";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Fulbari Restaurant | Best Restaurant Near Serampore, Hooghly, Kolkata",
    template: "%s | Fulbari Restaurant",
  },
  description:
    "Fulbari Restaurant — the best restaurant near Serampore, Hooghly and Kolkata. Enjoy authentic Bengali cuisine, Indian food, and Chinese dishes. A top-rated dhaba experience near Kolkata, Hooghly & Serampore.",
  keywords: [
    "best restaurant near Serampore",
    "best restaurant near Hooghly",
    "best restaurant near Kolkata",
    "best dhaba near Kolkata",
    "best dhaba near Hooghly",
    "best dhaba near Serampore",
    "restaurant in Serampore",
    "Bengali restaurant Hooghly",
    "Bengali food near Kolkata",
    "authentic Bengali cuisine Serampore",
    "Indian restaurant Hooghly",
    "top restaurant Serampore",
    "Fulbari restaurant",
    "dine near Serampore",
    "food near Kolkata",
    "restaurant near me Serampore",
    "dhaba near Kolkata",
    "best food Hooghly",
  ],
  authors: [{ name: "Fulbari Restaurant" }],
  creator: "Fulbari Restaurant",
  publisher: "Fulbari Restaurant",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fulbari-restraunt.vercel.app",
    siteName: "Fulbari Restaurant",
    title: "Fulbari Restaurant | Best Restaurant & Dhaba Near Serampore, Hooghly, Kolkata",
    description:
      "Visit Fulbari Restaurant — the best restaurant and dhaba near Serampore, Hooghly and Kolkata. Authentic Bengali, Indian & Chinese cuisine with a premium dining experience.",
    images: [
      {
        url: "https://fulbari-restraunt.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fulbari Restaurant — Best Restaurant near Serampore, Hooghly, Kolkata",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulbari Restaurant | Best Restaurant Near Serampore, Hooghly, Kolkata",
    description:
      "Authentic Bengali, Indian & Chinese cuisine. The best restaurant and dhaba near Kolkata, Hooghly & Serampore.",
  },
  alternates: {
    canonical: "https://fulbari-restraunt.vercel.app",
  },
  category: "restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Local Business Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: "Fulbari Restaurant",
              description:
                "The best restaurant and dhaba near Serampore, Hooghly, and Kolkata. Serving authentic Bengali, Indian, and Chinese cuisine.",
              url: "https://fulbari-restraunt.vercel.app",
              telephone: "+91-XXXXXXXXXX",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Serampore",
                addressLocality: "Serampore",
                addressRegion: "West Bengal",
                postalCode: "712201",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 22.7492,
                longitude: 88.3415,
              },
              servesCuisine: ["Bengali", "Indian", "Chinese"],
              priceRange: "₹₹",
              areaServed: [
                { "@type": "City", name: "Serampore" },
                { "@type": "City", name: "Hooghly" },
                { "@type": "City", name: "Kolkata" },
              ],
              hasMap: "https://maps.google.com/?q=Fulbari+Restaurant+Serampore",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday", "Tuesday", "Wednesday", "Thursday",
                    "Friday", "Saturday", "Sunday",
                  ],
                  opens: "11:00",
                  closes: "23:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable} ${hindSiliguri.variable} antialiased bg-background text-foreground font-body`}
      >
        <SmoothScrolling>
          {children}
          <FloatingContact />
        </SmoothScrolling>
      </body>
    </html>
  );
}
