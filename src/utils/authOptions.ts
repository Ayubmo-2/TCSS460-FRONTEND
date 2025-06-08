<<<<<<< HEAD
import type { NextAuthOptions } from 'next-auth';
=======
// next
import type { NextAuthOptions, User } from 'next-auth';
>>>>>>> parent of 02b047d (seeing if my changes work on the live vercel link)
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'Test123!@#',
    firstname: 'Test',
    lastname: 'User',
    company: 'Test Company',
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token'
  }
];

type CustomUser = User & {
  accessToken?: string;
  refreshToken?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
<<<<<<< HEAD
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
=======
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
>>>>>>> parent of 02b047d (seeing if my changes work on the live vercel link)
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch('https://group4-tcss460-web-api-88aed6dd5161.herokuapp.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          if (res.ok && user) {
            return {
<<<<<<< HEAD
              id: user.id || '1',
              email: user.email || credentials.email,
              name: user.name || 'User',
            } as any;
=======
              id: user.id,
              email: user.email,
              name: user.name,
              accessToken: user.accessToken,
            };
>>>>>>> parent of 02b047d (seeing if my changes work on the live vercel link)
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
<<<<<<< HEAD
  ],
=======
    CredentialsProvider({
      id: 'register',
      name: 'register',
      credentials: {
        firstname: { name: 'firstname', label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
        lastname: { name: 'lastname', label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' },
        username: { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter Username' },
        role: { name: 'role', label: 'Role', type: 'text', placeholder: 'Enter Role (1-5)' },
        phone: { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter Phone Number' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.firstname || !credentials?.lastname || !credentials?.username || !credentials?.role || !credentials?.phone) {
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
              refreshToken: '' // Not provided by API, but required by type
            };
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
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
>>>>>>> parent of 02b047d (seeing if my changes work on the live vercel link)
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
<<<<<<< HEAD
  secret: process.env.NEXTAUTH_SECRET,
};
=======
  secret: process.env.NEXTAUTH_SECRET_KEY,
  debug: true
};
>>>>>>> parent of 02b047d (seeing if my changes work on the live vercel link)
