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
        
        // Normalize email to prevent trailing spaces or uppercase issues
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
    async jwt ({ token, user, account }) {
      // If 'user' exists, it means this is the exact moment the user is logging in
      if (user) {
        if (account?.provider === 'google' || account?.provider === 'facebook') {
           // Fetch the actual MongoDB user to get the real _id instead of the Google/FB ID
           await connectDB();
           const dbUser = await User.findOne({ email: user.email });
           if (dbUser) {
             token.id = dbUser._id.toString();
             token.role = dbUser.role || 'user';
           }
        } else {
           // For Credentials, user.id is already the MongoDB _id from the authorize function
           token.id = user.id;
           token.role = (user as any).role || 'user';
        }
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