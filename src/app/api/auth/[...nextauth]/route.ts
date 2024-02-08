import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import { getUserDetailsByEmail } from "@/app/database/dbmethods";

// Configuration for NextAuth
const handler = NextAuth({
    // Setting up JWT-based session management
    session: {
        strategy: 'jwt'
    },
    // Configuration for authentication providers
    providers: [CredentialsProvider({
        credentials: {
            email: {}, // Email authentication data
            password: {} // Password authentication data
        },
        // Authentication logic
        async authorize(credentials: { email: string; password: string } | undefined, req: any): Promise<any> {
            if (credentials === undefined) {
                return null
            }
            // Fetching user details based on email from the database
            const result = await getUserDetailsByEmail(credentials.email);

            // Returning null in case of server error or sign-up issue
            if (result === 'Server error' || result === 'SignUp') {
                return null;
            }

            // Fetching user data
            const user = result[0];

            // Comparing passwords with the stored one
            const passwordCorrect = await compare(credentials.password, user.password);
            // Returning user data if password is correct
            if (passwordCorrect) {
                return {
                    name: user.id,
                    email: user.email,
                    image: user.type,
                };
            }

            // Returning null in case of incorrect password
            return null;
        }
    })]
});

// The exported handler manages the API endpoint
export { handler as GET, handler as POST };
