// Importálások
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";

// Inter font beállítása
const inter = Inter({ subsets: ["latin"] });

// Metaadatok a címhez és leíráshoz
export const metadata: Metadata = {
  title: "Film katalógus",
  description: "Fedezd fel a legújabb filmeket és értékelj is rájuk!",
};

// Alap elrendezési komponens
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML fejléc nyelve
    <html lang="en">
      {/* Oldal törzsének kezdete, Inter font osztály alkalmazása */}
      <body className={inter.className}>
        {/* Oldal fejléce, Header komponens */}
        <Header />
        {/* Gyerek komponensek (tartalom) */}
        {children}
      </body>
    </html>
  );
}
