import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_PASS
        }
      },
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest ({ identifier, url, provider }) {
        const transport = nodemailer.createTransport(provider.server)

        const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 16px; border: 1px solid #f1f5f9;">
                        <h1 style="color: #020617; font-size: 28px; font-weight: 900; text-transform: uppercase; font-style: italic; margin-bottom: 24px;">STRENOXA<span style="color: #ec1313;">.</span></h1>
                        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px; font-weight: 500;">
                            You requested a secure login link for your Strenoxa account. Click the button below to instantly sign in—no password required.
                        </p>
                        <a href="${url}" style="display: inline-block; background-color: #ec1313; color: #ffffff; padding: 16px 32px; border-radius: 8px; font-weight: bold; font-size: 16px; text-decoration: none; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">
                            Sign In to Strenoxa
                        </a>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
                        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
                            If you did not request this email, you can safely ignore it. The link will expire automatically in 24 hours.
                        </p>
                    </div>
                `

        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to Strenoxa`,
          text: `Sign in to Strenoxa by clicking here: ${url}`,
          html: html
        })

        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`)
        }
      }
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
        const user = await User.findOne({ email: credentials.email })
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
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session ({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id as string
        ;(session.user as any).role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verifyRequest=true'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
