import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function POST (request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, source } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const PROMO_CODE = 'STRENOXA15'
    const existingSubscriber = await Subscriber.findOne({ email })

    if (existingSubscriber) {
      if (existingSubscriber.isSubscribed) {
        if (source === 'lead_magnet') {
          return NextResponse.json(
            { error: 'Email already registered!', code: PROMO_CODE },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: 'You are already on the list!' },
          { status: 400 }
        )
      } else {
        existingSubscriber.isSubscribed = true
        existingSubscriber.unsubscribedAt = undefined
        await existingSubscriber.save()
      }
    } else {
      await Subscriber.create({ email })
      console.log(`[DATABASE] Saved new subscriber: ${email}`)
    }

    try {
      if (source === 'lead_magnet') {
        await transporter.sendMail({
          from: `"Strenoxa Supplements" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Your 15% Off Code is Inside! 🚀',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #ec1313; text-transform: uppercase;">Welcome to the Squad!</h1>
                <p>You made the right choice. Here is your exclusive 15% off discount code:</p>
                <div style="background: #0a0a0a; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
                    ${PROMO_CODE}
                </div>
                <p>Apply this at checkout to fuel your next workout.</p>
                <p>Stay strong,<br/>The Strenoxa Team</p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
              Don't want these emails anymore? <a href=" http://172.28.211.122:3000/unsubscribe?email=${email}" style="color: #666; text-decoration: underline;">Unsubscribe here</a>.
          </p>
          `
        })

        return NextResponse.json(
          { message: 'Discount unlocked!', code: PROMO_CODE },
          { status: 201 }
        )
      } else {
        await transporter.sendMail({
          from: `"Strenoxa Supplements" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Welcome to the Strenoxa Community 🏋️‍♂️',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="text-transform: uppercase;">Welcome to the Strenoxa Community!</h1>
                <p>Thanks for subscribing! You are now on the insider list.</p>
                <p>Keep an eye on your inbox for expert training advice, early access to our newest flavor drops, and exclusive flash sales.</p>
                <p>Stay strong,<br/>The Strenoxa Team</p>
            </div>
            <p style="text-align: center; font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
              Don't want these emails anymore? <a href=" http://172.28.211.122:3000/unsubscribe?email=${email}" style="color: #666; text-decoration: underline;">Unsubscribe here</a>.
          </p>
          `
        })

        return NextResponse.json(
          { message: 'Welcome to the squad!' },
          { status: 201 }
        )
      }
    } catch (emailError) {
      console.error('Resend Failed:', emailError)
      return NextResponse.json(
        {
          message: 'Saved to database, but email failed to send',
          code: source === 'lead_magnet' ? PROMO_CODE : null
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Newsletter API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
