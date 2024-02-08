'use client'
import { signOut } from "next-auth/react";
import Link from 'next/link';

// A SignOut component
export default function SignOut() {
    return (
        // Link component that generates a clickable reference
        <Link href="/#" onClick={() => {signOut();}}>
            SignOut {/* Text for sign out */}
        </Link>
    );
}
