import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import ActivityLog from '@/models/ActivityLog'

export async function PATCH (req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (userRole !== 'super admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { userId, role } = await req.json()

    if (!userId || !role) {
      return NextResponse.json({ message: 'Missing data' }, { status: 400 })
    }

    if (role === 'super admin') {
      return NextResponse.json(
        {
          message:
            'Security Policy: Super Admin promotions must be done directly in the database'
        },
        { status: 403 }
      )
    }

    await connectDB()

    const targetUser = await User.findById(userId)
    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (targetUser.email === session?.user?.email) {
      return NextResponse.json(
        { message: 'Cannot change your own role' },
        { status: 400 }
      )
    }

    // Update the user's role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    await ActivityLog.create({
      userEmail: session?.user?.email || 'Unknown Admin',
      action: 'Updated User Role',
      details: `Changed role of ${targetUser.email} to ${role}`
    })

    return NextResponse.json({ message: 'Role updated successfully' })
  } catch (error) {
    console.error('User Role Update Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
