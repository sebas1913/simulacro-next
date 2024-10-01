import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const response: Response = await fetch(`https://simuate-test-backend-1.onrender.com/api/auth/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    })
                });

                const user = await response.json();

                // Si el inicio de sesión es exitoso, devuelve el usuario
                if (response.ok && user) {
                    return user;
                }

                // Si el inicio de sesión falla, retorna null
                return null;
            }
        })
    ],
    // Esta es la página de inicio de sesión, como yo tengo un Modal, no la pongo
    // pages: {
    //     signIn: '/auth/signin', 
    // },
    session: {
        strategy: "jwt", 
    },
    callbacks: {
        async jwt({ token, user }) {
            // Añadir datos al token JWT
            if (user) {
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            // Añadir datos a la sesión
            if (session.user) {
                session.user.name = token.name as string;
                session.user.email = token.email as string;
            }
            return session;
        }
    },
    secret: 'abcd.1234', 
    debug: true,    
});

export { handler as GET, handler as POST };
