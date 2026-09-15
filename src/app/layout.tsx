import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Videqqu — Streaming Video",
    template: "%s",
  },
  description:
    "Platform streaming video dengan konten yang dikelola langsung oleh admin.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    siteName: "Videqqu",
    title: "Videqqu — Streaming Video",
    description:
      "Tonton video favoritmu di Videqqu. Gratis, cepat, dan mudah dibagikan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videqqu — Streaming Video",
    description:
      "Tonton video favoritmu di Videqqu. Gratis, cepat, dan mudah dibagikan.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
