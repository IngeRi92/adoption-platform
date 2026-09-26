import { Poppins, Kalam } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--nf-poppins",
  display: "swap",
});

// Used for the dog name heading on the dog detail page
const kalam = Kalam({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--nf-kalam",
  display: "swap",
});

const siteDescription =
  "Find your perfect dog. Adopt or buy responsibly. Europe’s hub for dog lovers.";

// Ported from frontend/2-tailwind/3-html-partials/head.html
export const metadata = {
  metadataBase: new URL("https://www.dogeli.com"),
  title: {
    default: "Find your perfect dog | Dogeli",
    template: "%s | Dogeli",
  },
  description: siteDescription,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Dogeli",
    title: siteDescription,
    description: siteDescription,
    url: "/",
    images: [
      {
        url: "/images/logosocialmedia.png",
        width: 1125,
        height: 1125,
        alt: "Dogeli — Find your perfect dog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteDescription,
    description: siteDescription,
    images: ["/images/logosocialmedia.png"],
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dogeli",
  url: "https://www.dogeli.com",
  logo: "https://www.dogeli.com/images/logoheader.png",
  sameAs: ["https://www.facebook.com/dogeli", "https://www.instagram.com/dogeli/"],
  contactPoint: [
    { "@type": "ContactPoint", contactType: "Customer Support", email: "info@dogeli.com" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${kalam.variable}`}>
      <body className="bg-sage-green font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
