import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TeachingModeProvider } from "@/lib/hooks/use-teaching-mode";
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
  title: "TimingRx — Evidence-Based Delivery Timing",
  description:
    "Comprehensive clinical decision support for obstetric delivery timing. " +
    "201+ conditions, risk calculator with confidence scoring, interactive visualizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TeachingModeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </TeachingModeProvider>
      </body>
    </html>
  );
}
