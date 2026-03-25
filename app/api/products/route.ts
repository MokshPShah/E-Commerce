import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

// 🚨 THIS IS THE MAGIC LINE: It completely disables Next.js caching for this API route
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const trending = searchParams.get('trending')

    let query: any = {}

    if (category) {
      query.category = category
    }
    if (trending === 'true') {
      query.isTrending = true
    }

    // .lean() strips the heavy Mongoose wrappers so Next.js can parse it into JSON
    const products = await Product.find(query).sort({ createdAt: -1 }).lean()

    // Adding this console.log so you can see the real data in your VS Code terminal
    console.log(`[API] Fetched ${products.length} products from DB.`);

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// ... Keep your existing POST function down here exactly as it was
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const newProduct = await Product.create(body);
    
    console.log(`[DATABASE] Added new product: ${newProduct.name}`);
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error('Product Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}