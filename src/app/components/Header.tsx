import React from 'react';
import Link from 'next/link';

// Navigációs sáv Tailwind CSS segítségével
// Header komponens felelős a fejléc megjelenítéséért

export const Header: React.FC = () => {
    return (
        // A fejléc háttérszíne szürke (#800), fehér szöveggel és négy padding egységgel
        <header className="bg-gray-800 text-white p-4">
            {/* A tartalom konténert középre igazítom és elrendezem az elemeket azáltal, 
            hogy térközöket használok köztük */}
            <div className="container mx-auto flex justify-between items-center">
                {/* A fejléc bal felső részén lévő szöveg, amely egy Link komponens, visszavezet a főoldalra */}
                <div className="text-xl font-bold">
                    <Link href="/">
                        Film Katalógus
                    </Link>
                </div>
                {/* A navigációs menü, amely tartalmazza a SignUp és SignIn linkeket */}
                <nav>
                    <ul className="flex space-x-4">
                        {/* Film létrehozása link */}
                        <li>
                            <Link href="/editorpanel">
                                +Film
                            </Link>
                        </li>
                        {/* SignUp link */}
                        <li>
                            <Link href="/#">
                                SignUp
                            </Link>
                        </li>
                        {/* SignIn link */}
                        <li>
                            <Link href="/#">
                                SignIn
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};
