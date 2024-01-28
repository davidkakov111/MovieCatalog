'use client'
import { signOut } from "next-auth/react";
import Link from 'next/link';

export default function SignOut() {
    return (
        <Link href="/#" onClick={() => {signOut();}}>
            SignOut
        </Link>
    );
}
