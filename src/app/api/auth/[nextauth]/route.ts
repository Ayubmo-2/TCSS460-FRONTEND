import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (credentials?.email === 'test@test.com' && credentials?.password === 'test123') {
          return {
            id: '1',
            email: 'test@test.com',
            name: 'Test User',
            accessToken: 'test-token',
            refreshToken: 'test-refresh-token'
          } as any // Cast to any to bypass strict typing
        }
        return null
      }
    })
  ]
})

export { handler as GET, handler as POST }