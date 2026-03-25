import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import ActivityLog from '@/models/ActivityLog'

export async function GET () {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role
    const userEmail = session?.user?.email

    if (userRole !== 'admin' && userRole !== 'super admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    await connectDB()

    let query = {}
    {
      if (userRole === 'admin') {
        query = { userEmail: userEmail }
      }
    }

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Fetch Logs Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
