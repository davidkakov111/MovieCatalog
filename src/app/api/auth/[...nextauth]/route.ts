import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import { getUserDetailsByEmail } from "@/app/database/dbmethods";

const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [CredentialsProvider({
        credentials: {
            email: {  },
            password: {  }
            },
        async authorize(credentials:any, req) {
            const result = await getUserDetailsByEmail(credentials.email)
            if (result === 'Szerverhiba' || result === 'SignUp') {
                return null;
            }
            const user = result[0]
            const passwordCorrect = await compare(credentials?.password, user.password)
            
            if (passwordCorrect) {
                return {
                    id: user.id,
                    email: user.email,
                    type: user.type
                }
            }
            return null;
        }
    })]
})

export {handler as GET, handler as POST};