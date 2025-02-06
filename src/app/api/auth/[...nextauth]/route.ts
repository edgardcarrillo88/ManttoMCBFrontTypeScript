import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import nextAuth from 'next-auth'

const handler = nextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        // CredentialsProvider({
        //     name: 'Credentials',
        //     credentials: {
        //         email: { label: "email", type: "text" },
        //         password: {  label: "Password", type: "password" }
        //     },
        //     async authorize(credentials, req) {
        //         const user = { id: "1", name: 'J Smith', email: ''}
        //         if (user) {
        //             return user
        //         } else {
        //             return null
        //         }
        //     }})
    ]
})

export { handler as GET, handler as POST }
