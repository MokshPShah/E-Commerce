import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function PATCH (req: Request) {
  try {
    const session = await getServerSession(authOptions)

    const userRole = (session?.user as any)?.role

    if (userRole !== 'admin' && userRole !== 'super admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { orderId, status } = await req.json()

    if (!orderId || !status) {
      return NextResponse.json({ message: 'Missing Data' }, { status: 400 })
    }

    await connectDB()
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    )

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Status updated', order: updatedOrder })
  } catch (error) {
    console.error('Order Update Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
