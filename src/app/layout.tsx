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
  title: "Daniel Morgan - Product Engineer & Designer",
  description:
    "Portfolio of Daniel Morgan, a product engineer and designer building iOS apps, full-stack products, AI experiments, and audio-first experiences.",
  authors: [{ name: "Daniel Morgan" }],
  creator: "Daniel Morgan",
  keywords: [
    "Daniel Morgan",
    "product engineer",
    "product designer",
    "iOS",
    "full-stack",
    "AI",
    "portfolio",
  ],
  openGraph: {
    title: "Daniel Morgan - Product Engineer & Designer",
    description:
      "Selected iOS, full-stack, AI, and audio-first product work by Daniel Morgan.",
    siteName: "Daniel Morgan",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Daniel Morgan - Product Engineer & Designer",
    description:
      "Selected iOS, full-stack, AI, and audio-first product work by Daniel Morgan.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body>{children}</body>
    </html>
  );
}
