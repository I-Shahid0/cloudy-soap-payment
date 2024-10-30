import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import Asset from "@/components/asset";
import Link from "next/link";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Cloudy Soap",
  description: "Cloudy Soap",
  icons: {
    icon: "/favicon.png",
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
        className={`${quicksand.variable} antialiased bg-amber-50 flex flex-col items-center justify-center`}
      >
        <Link href="/">
          <Asset />
        </Link>
        {children}
      </body>
    </html>
  );
}
