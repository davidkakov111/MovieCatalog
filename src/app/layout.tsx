// Imports
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SignOut from "./Auth/SignOut/SignOut";
import Link from 'next/link';

// Set up Inter font
const inter = Inter({ subsets: ["latin"] });

// Metadata for title and description
export const metadata: Metadata = {
  title: "Movie Catalog",
  description: "Discover the latest movies and rate them!",
};

// Basic layout component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  const user = session?.user;
  return (
    <html lang="en">
      {/* Beginning of the page body, applying Inter font class */}
      <body className={`${inter.className} min-h-screen bg-gray-720`}>
        {/* Page header, Header component */}
        {/* Header with a gray (#800) background, white text, and four units of padding */}
        <header className="bg-gray-800 text-white p-4">
          {/* Centering the content container and arranging elements using spacing */}
          <div className="container mx-auto flex justify-between items-center">
            {/* Text in the upper left corner of the header, a Link component leading to the homepage */}
            <div className="text-xl font-bold">
              <Link href="/">Movie Catalog</Link>
            </div>
            {/* Navigation menu containing SignUp and SignIn links */}
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link href="/Analytics">Analytics</Link>
                </li>
                {/* Create Movie link */}
                {user?.image === "Editor" ? (
                  <li>
                    <Link href="/editorpanel">+Movie</Link>
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
        {/* Child components (content) */}
        {children}
      </body>
    </html>
  );
}
