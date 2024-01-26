import React from 'react';
import Link from 'next/link';

// Navigacios sav Tailwind CSS segítségével 

export const Header:React.FC = () => {
    return (
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/">
              Film Katalógus
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/#">
                  SignUp
                </Link>
              </li>
              <li>
                <Link href="/#">
                  SignIn
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    )
}
