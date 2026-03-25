import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }
        await connectDB()
        
        // FIX 1: Normalize email to prevent trailing spaces or uppercase issues
        const normalizedEmail = credentials.email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail })
        
        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }
        
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )
        
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn ({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          await connectDB()
          const existingUser = await User.findOne({ email: user.email })
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: 'user'
            })
          }
          return true
        } catch (error) {
          console.error('Sign-In Error:', error)
          return false
        }
      }
      return true
    },
    // FIX 2: Only attach data to the token ONCE during the initial login.
    // This stops NextAuth from hammering your database on every single page load!
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session ({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role || 'user'
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }