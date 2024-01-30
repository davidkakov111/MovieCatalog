import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import { getUserDetailsByEmail } from "@/app/database/dbmethods";

// NextAuth konfiguráció
const handler = NextAuth({
    // JWT alapú session kezelés beállítása
    session: {
        strategy: 'jwt'
    },
    // Hitelesítő szolgáltatók konfigurációja
    providers: [CredentialsProvider({
        credentials: {
            email: {}, // E-mail hitelesítési adatok
            password: {} // Jelszó hitelesítési adatok
        },
        // Hitelesítési logika
        async authorize(credentials: any, req: any) {
            // Felhasználói adatok lekérése az e-mail cím alapján az adatbázisból
            const result = await getUserDetailsByEmail(credentials.email);

            // Szerverhiba vagy regisztrációs hiba esetén visszatérés null értékkel
            if (result === 'Szerverhiba' || result === 'SignUp') {
                return null;
            }

            // Felhasználó adatainak lekérése
            const user = result[0];

            // Jelszó összehasonlítás a tárolt jelszóval
            const passwordCorrect = await compare(credentials?.password, user.password);

            // Jelszó helyes, visszatérés felhasználói adatokkal
            if (passwordCorrect) {
                return {
                    id: user.id,
                    name: user.id,
                    email: user.email,
                    image: user.type,
                };
            }

            // Helytelen jelszó esetén visszatérés null értékkel
            return null;
        }
    })],
});

// Az exportált handler az API végpontot kezeli
export { handler as GET, handler as POST };
