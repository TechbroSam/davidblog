// src/lib/auth.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const isAdminEmail = credentials.email === process.env.ADMIN_EMAIL;
        const isAdminPassword = credentials.password === process.env.ADMIN_PASSWORD;

        if (isAdminEmail && isAdminPassword) {
          // Return a user object if credentials are correct
          return { id: "1", name: "Admin", email: credentials.email };
        }
        // Return null if credentials are not valid
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login', // Redirect users to /login if they are not authenticated
  }
};