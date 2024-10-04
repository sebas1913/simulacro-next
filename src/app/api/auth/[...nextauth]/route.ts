import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; 
            name?: string | null;
            email?: string | null;
            token?: any; 
        };
        accessToken?: any; // Se añade el token a la sesión
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const response = await fetch(`https://simuate-test-backend-1.onrender.com/api/auth/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    })
                });
            
                const data = await response.json();
            
                if (response.ok && data.user) {
                    return {
                        ...data.user,
                        token: data.token // Guardamos el token del back
                    };
                }
            
                return null;
            }
        })
    ],
    debug: true,  
    session: {
        strategy: "jwt", 
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; 
                token.name = user.name;
                token.email = user.email;
            }
            return token; // Retorna el token modificado
        },
        
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.accessToken = token.accessToken; // Añadir el token a la sesión
            }
            return session; // Retorna la sesión modificada
        }
    },  
});

export { handler as GET, handler as POST };
