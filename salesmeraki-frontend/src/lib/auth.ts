import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("authorize function called with email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          const apiUrl = `${process.env.API_BASE_URL || 'http://localhost:5000/api'}/auth/login`;
          console.log("Attempting to fetch from:", apiUrl);
          
          // Call our mock backend
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log('Auth API response status:', response.status);
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Auth API error:', errorText);
            return null;
          }

          const data = await response.json();
          console.log('Auth API success, user data:', data.user);
          
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT callback called", { hasUser: !!user, hasAccount: !!account });
      
      // Initial sign in
      if (user) {
        // For credentials provider
        if (user.accessToken) {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }
        
        // For OAuth providers like Google
        if (account && account.provider === "google") {
          console.log("Processing Google account:", {
            idToken: account.id_token ? `${account.id_token.substring(0, 10)}...` : null,
            accessToken: account.access_token ? `${account.access_token.substring(0, 10)}...` : null,
            email: user.email
          });
          
          try {
            // Exchange the Google token for our own backend token
            const apiUrl = `${process.env.API_BASE_URL}/auth/google`;
            console.log("Calling backend Google auth endpoint:", apiUrl);
            
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                token: account.id_token || account.access_token,
                email: user.email 
              }),
            });
            
            console.log("Backend Google auth response status:", response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log("Backend auth successful, received tokens");
              token.accessToken = data.accessToken;
              token.refreshToken = data.refreshToken;
            } else {
              const errorText = await response.text();
              console.error('Failed to exchange Google token:', errorText);
            }
          } catch (error) {
            console.error('Error exchanging Google token:', error);
          }
        }
        
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback called", { hasToken: !!token });
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user = {
          id: token.user?.id,
          name: token.user?.name,
          email: token.user?.email,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  debug: true, // Enable debug mode
};