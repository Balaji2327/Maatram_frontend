import type { Metadata } from "next";
import { Hanken_Grotesk, Libre_Franklin } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scholar & Applicant Portal | Maatram Foundation",
  description:
    "Empowering Dreams Through Education. Sign in to your Maatram Foundation student portal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${libreFranklin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-primary bg-[#F8FAFC] text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
