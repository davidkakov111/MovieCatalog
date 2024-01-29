// Importálások
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SignOut from "./Auth/SignOut/SignOut"
import Link from 'next/link';
import { setEngine } from "crypto";

// Inter font beállítása
const inter = Inter({ subsets: ["latin"] });

// Metaadatok a címhez és leíráshoz
export const metadata: Metadata = {
  title: "Film katalógus",
  description: "Fedezd fel a legújabb filmeket és értékelj is rájuk!",
};

// Alap elrendezési komponens
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession()
  const user = session?.user
  return (
    <html lang="en">
      {/* Oldal törzsének kezdete, Inter font osztály alkalmazása */}
      <body className={`${inter.className} min-h-screen bg-gray-720`}>
        {/* Oldal fejléce, Header komponens */}
        {/* A fejléc háttérszíne szürke (#800), fehér szöveggel és négy padding egységgel */}
        <header className="bg-gray-800 text-white p-4">
          {/* A tartalom konténert középre igazítom és elrendezem az elemeket azáltal, 
              hogy térközöket használok köztük */}
          <div className="container mx-auto flex justify-between items-center">
            {/* A fejléc bal felső részén lévő szöveg, amely egy Link komponens, visszavezet a főoldalra */}
            <div className="text-xl font-bold">
              <Link href="/">Film Katalógus</Link>
            </div>
            {/* A navigációs menü, amely tartalmazza a SignUp és SignIn linkeket */}
            <nav>
              <ul className="flex space-x-4">
                {/* Film létrehozása link */}
                {user?.image === "Editor" ? (
                  <li>
                    <Link href="/editorpanel">+Film</Link>
                  </li>
                ) : (
                  <div></div>
                )}
                {/* Admin panel */}
                {user?.image === "Admin" ? (
                  <li>
                    <Link href="/Admin">Admin</Link>
                  </li>
                ) : (
                  <div></div>
                )}
                {session ? (
                  <li>
                    <SignOut />
                  </li>
                ) : (
                  <>
                    <li>
                      <Link href="/Auth/SignIn">SignIn</Link>
                    </li>
                    <li>
                      <Link href="/Auth/SignUp">SignUp</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>
        {/* Gyerek komponensek (tartalom) */}
        {children}
      </body>
    </html>
  );
}
