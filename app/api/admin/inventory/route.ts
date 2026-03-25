import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import ActivityLog from '@/models/ActivityLog'

export async function POST (req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (userRole !== 'admin' && userRole !== 'super admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    if (!body.name || !body.slug || !body.price || !body.category) {
      return NextResponse.json(
        { message: 'Missing required basic fields' },
        { status: 400 }
      )
    }

    await connectDB()

    const newProduct = await Product.create({
      name: body.name,
      slug: body.slug,
      desc: body.desc,
      longDesc: {
        paragraphs: body.longDesc?.paragraphs || [],
        bullets: body.longDesc?.bullets || []
      },
      price: Number(body.price),
      category: body.category,
      flavors: body.flavors || [],
      images: body.images || [],
      inStock: Boolean(body.inStock ?? true),
      isTrending: Boolean(body.isTrending ?? false),
      rating: Number(body.rating || 0),
      reviewCount: Number(body.reviewCount || 0),
      supplementFacts: {
        servingSize: body.supplementFacts?.servingSize || '',
        servingsPerContainer: Number(
          body.supplementFacts?.servingsPerContainer || 0
        ),
        ingredients: body.supplementFacts?.ingredients || []
      },
      stock: Number(body.stock || 0)
    })

    // LOG: Product Creation
    await ActivityLog.create({
      userEmail: session?.user?.email || 'Unknown Admin',
      action: 'Added New Product',
      details: `Created ${newProduct.name}`
    })

    return NextResponse.json(
      { message: 'Product added successfully!', product: newProduct },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create Product Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH (req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (userRole !== 'admin' && userRole !== 'super admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { productId, name, category, price, stock, restore } = body
    if (!productId) {
      return NextResponse.json(
        { message: 'Missing Product ID' },
        { status: 400 }
      )
    }

    await connectDB()

    if (restore === true) {
      const restoredProduct = await Product.findByIdAndUpdate(
        productId,
        { $set: { isDeleted: false }, $unset: { deletedAt: 1 } },
        { new: true }
      )

      // LOG: Product Restore
      await ActivityLog.create({
        userEmail: session?.user?.email || 'Unknown Admin',
        action: 'Restored Product',
        details: `Restored ${restoredProduct.name} from the bin`
      })

      return NextResponse.json(
        { message: 'Product Restored', product: restoredProduct },
        { status: 200 }
      )
    }

    const safeUpdateData: any = {}
    if (name !== undefined) safeUpdateData.name = String(name).trim()
    if (category !== undefined)
      safeUpdateData.category = String(category).trim()
    if (price !== undefined) safeUpdateData.price = Number(price)
    if (stock !== undefined) safeUpdateData.stock = Number(stock)

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: safeUpdateData },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    // LOG: Standard Update
    await ActivityLog.create({
      userEmail: session?.user?.email || 'Unknown Admin',
      action: 'Updated Inventory',
      details: `Updated ${updatedProduct.name}`
    })

    return NextResponse.json({
      message: 'Stock updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    console.error('Stock Update Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE (req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userRole = (session?.user as any)?.role

    if (userRole !== 'admin' && userRole !== 'super admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      )
    }

    await connectDB()

    if (action === 'hard') {
      await Product.findByIdAndDelete(id)
      
      // LOG: Hard Delete
      await ActivityLog.create({
        userEmail: session?.user?.email || 'Unknown Admin',
        action: 'Permanently Deleted Product',
        details: `Destroyed product record (ID: ${id})`
      })

      return NextResponse.json({ message: 'Product permanently deleted' })
    } else {
      const deletedProduct = await Product.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date()
      }, { new: true }) // Added {new: true} to get the name for the log

      // LOG: Soft Delete
      await ActivityLog.create({
        userEmail: session?.user?.email || 'Unknown Admin',
        action: 'Trashed Product',
        details: `Moved ${deletedProduct?.name || id} to the recycle bin`
      })

      return NextResponse.json({ message: 'Product moved to bin' })
    }
  } catch (error) {
    console.error('Delete Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}