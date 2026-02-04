import "./globals.css";
import Providers from "@/components/layout/Providers";
import SplashScreen from "@/components/ui/SplashScreen";

export const metadata = {
  metadataBase: new URL("https://iscar.vercel.app"),
  title: "ISCAR",
  description:
    "Official website of ISCAR. Wadah aspirasi, kreativitas, dan informasi terkini seputar kegiatan siswa dan organisasi OSIS.",

  keywords: [
      "ISCAR",
      "ISCAR",
      "OSIS",
      "Organisasi Siswa",
      "Website Sekolah",
      "Kegiatan Siswa",
      "Aspirasi Siswa",
      "Program Kerja OSIS",
    ],

  authors: [{ name: "ISCAR IT Department" }],
  creator: "ISCAR",
  publisher: "ISCAR",

  robots: "index, follow",

  alternates: {
    canonical: "https://iscar.vercel.app",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://iscar.vercel.app",
    siteName: "ISCAR",
    title: "ISCAR — Bergerak Bersama, Berkarya Nyata",
    description:
      "Pantau terus informasi terbaru mengenai program kerja dan kegiatan seru dari ISCAR di sini.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ISCAR Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ISCAR 2026 — Official Website",
    description:
      "Wadah informasi dan kreativitas siswa melalui organisasi OSIS ISCAR.",
    images: ["/og-image.png"],
  },

icons: {
  icon: [
    { url: "/assets/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/assets/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/assets/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    { url: "/assets/favicon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
  ],
  apple: [
    { url: "/assets/favicon/apple-icon-57x57.png", sizes: "57x57" },
    { url: "/assets/favicon/apple-icon-60x60.png", sizes: "60x60" },
    { url: "/assets/favicon/apple-icon-72x72.png", sizes: "72x72" },
    { url: "/assets/favicon/apple-icon-76x76.png", sizes: "76x76" },
    { url: "/assets/favicon/apple-icon-114x114.png", sizes: "114x114" },
    { url: "/assets/favicon/apple-icon-120x120.png", sizes: "120x120" },
    { url: "/assets/favicon/apple-icon-144x144.png", sizes: "144x144" },
    { url: "/assets/favicon/apple-icon-152x152.png", sizes: "152x152" },
    { url: "/assets/favicon/apple-icon-180x180.png", sizes: "180x180" },
  ],
  shortcut: "/assets/favicon/favicon.ico"
},

};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <SplashScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
