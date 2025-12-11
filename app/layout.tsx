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
  title: "Rekaz Website Builder - Visual Drag & Drop Page Builder",
  description: "Build beautiful websites visually with our intuitive drag-and-drop builder. Add sections, edit properties, and export your designs as JSON.",
  keywords: ["website builder", "drag and drop", "page builder", "Next.js", "React"],
  authors: [{ name: "Rekaz" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Rekaz Website Builder",
    description: "Build beautiful websites visually with our intuitive drag-and-drop builder.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
