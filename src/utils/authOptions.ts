// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axiosInstance from './axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      } as any, // Add 'as any' to bypass strict typing
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch('https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();
          console.log('API Login Response:', user); // Debug log to see what API returns

          if (res.ok && user) {
            return {
              id: user.id || '1',
              email: user.email || credentials.email,
              name: user.name || 'User',
              accessToken: user.accessToken || user.token || 'mock-jwt-token',
              refreshToken: user.refreshToken || '', // Add required refreshToken
            } as any; // Cast to any to bypass strict User type
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: 'register',
      name: 'register',
      credentials: {
        firstname: { label: 'First Name', type: 'text' },
        lastname: { label: 'Last Name', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        username: { label: 'Username', type: 'text' },
        role: { label: 'Role', type: 'text' },
        phone: { label: 'Phone', type: 'text' }
      } as any, // Add 'as any' to bypass strict typing
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.firstname ||
            !credentials?.lastname || !credentials?.username || !credentials?.role || !credentials?.phone) {
            throw new Error('All required fields must be provided');
          }

          const response = await axiosInstance.post('/register', {
            firstname: credentials.firstname.trim(),
            lastname: credentials.lastname.trim(),
            email: credentials.email.trim(),
            password: credentials.password,
            username: credentials.username.trim(),
            role: credentials.role.trim(),
            phone: credentials.phone.trim()
          });

          if (response.data && response.data.accessToken && response.data.user) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken || '', // Add required refreshToken
            } as any; // Cast to any to bypass strict User type
          }
          return null;
        } catch (error: any) {
          console.error('Registration error:', error);
          throw new Error(error.response?.data?.message || 'Registration failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET, // Fixed: use NEXTAUTH_SECRET instead of NEXTAUTH_SECRET_KEY
  debug: true
};