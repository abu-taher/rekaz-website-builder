import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
