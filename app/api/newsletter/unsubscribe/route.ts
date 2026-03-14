import connectDB from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { NextResponse } from 'next/server'

export async function PATCH (request: Request) {
  try {
    await connectDB()

    const body = await request.json()

    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const updateSubscriber = await Subscriber.findOneAndUpdate(
      { email: email },
      {
        isSubscribed: false,
        unsubscribedAt: new Date()
      },
      { new: true }
    )

    if (!updateSubscriber) {
      return NextResponse.json({ error: 'Email not found' }, { status: 400 })
    }

    return NextResponse.json(
      { message: 'You have been successfully unsubscribed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unsubscribe API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
