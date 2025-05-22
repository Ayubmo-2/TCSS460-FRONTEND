import NextAuth from 'next-auth';
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

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          // Mock API call - find user
          const user = mockUsers.find(u => u.email === credentials.email.trim());
          
          if (!user || user.password !== credentials.password) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
            accessToken: user.token,
            refreshToken: user.refreshToken
          };
        } catch (error: any) {
          console.error('Login error:', error);
          throw new Error(error.message || 'Invalid credentials');
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'register',
      credentials: {
        firstname: { name: 'firstname', label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
        lastname: { name: 'lastname', label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Enter Company' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.firstname || !credentials?.lastname) {
            throw new Error('All required fields must be provided');
          }

          // Mock API call - check if user exists
          const existingUser = mockUsers.find(u => u.email === credentials.email.trim());
          if (existingUser) {
            throw new Error('User already exists');
          }

          // Mock API call - create new user
          const newUser = {
            id: String(mockUsers.length + 1),
            email: credentials.email.trim(),
            password: credentials.password,
            firstname: credentials.firstname.trim(),
            lastname: credentials.lastname.trim(),
            company: credentials.company?.trim() || '',
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token'
          };

          mockUsers.push(newUser);

          return {
            id: newUser.id,
            email: newUser.email,
            name: `${newUser.firstname} ${newUser.lastname}`,
            accessToken: newUser.token,
            refreshToken: newUser.refreshToken
          };
        } catch (error: any) {
          console.error('Registration error:', error);
          throw new Error(error.message || 'Registration failed');
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.provider = account?.provider || 'credentials';
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.provider = token.provider || 'credentials';
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    }
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
  secret: process.env.NEXTAUTH_SECRET_KEY,
  debug: true
}); 