'use client'
import { signOut } from "next-auth/react";
import Link from 'next/link';

// A SignOut komponens
export default function SignOut() {
    return (
        // Link komponens, ami egy kattintható hivatkozást generál
        <Link href="/#" onClick={() => {signOut();}}>
            SignOut {/* Kijelentkezés szövege */}
        </Link>
    );
}