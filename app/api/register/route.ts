import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST (req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      )
    }

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already registered. Please try to login.' },
        { status: 400 }
      )
    }

    const hashPass = await bcrypt.hash(password, 12)

    await User.create({
      name,
      email,
      password: hashPass,
      role: 'user'
    })

    return NextResponse.json(
      { message: 'User registered successfully.' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'An error occurred during registration.' },
      { status: 500 }
    )
  }
}
