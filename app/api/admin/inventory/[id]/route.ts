import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: String }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (userRole !== 'admin' && userRole !== 'super admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;

    await connectDB()

    const body = await req.json()
    delete body._id
    delete body.createdAt
    delete body.isDeleted
    delete body.deletedAt

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!updatedProduct)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json(
      {
        message: 'Product updated successfully',
        product: updatedProduct
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}
