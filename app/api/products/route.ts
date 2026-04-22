import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let filteredProducts = [...products]

    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category === category)
    }

    if (search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredProducts,
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validation
    if (!productData.name || !productData.price || !productData.description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, price, and description are required',
        },
        { status: 400 },
      )
    }

    const newProduct = {
      id: Date.now().toString(),
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image:
        productData.image ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      sizes: productData.sizes || ['S', 'M', 'L'],
      category: productData.category || 'clothing',
      stock: parseInt(productData.stock) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 },
    )
  }
}
