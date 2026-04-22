import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { products } from '@/lib/data/products'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const product = products.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found', error: 'NOT_FOUND' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch product',
        error: 'FETCH_ERROR',
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const productIndex = products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found', error: 'NOT_FOUND' },
        { status: 404 },
      )
    }

    const updateData = await request.json()

    // Validation
    if (!updateData.name || !updateData.price || !updateData.description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, price, and description are required',
          error: 'VALIDATION_ERROR',
        },
        { status: 400 },
      )
    }

    const updatedProduct = {
      ...products[productIndex],
      name: updateData.name,
      description: updateData.description,
      price: parseFloat(updateData.price),
      image: updateData.image || products[productIndex].image,
      sizes: updateData.sizes || products[productIndex].sizes,
      category: updateData.category || products[productIndex].category,
      stock: parseInt(updateData.stock) || products[productIndex].stock,
      updatedAt: new Date().toISOString(),
    }

    products[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update product',
        error: 'UPDATE_ERROR',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const productIndex = products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      )
    }

    const deletedProduct = products[productIndex]
    products.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete product',
        error: 'DELETE_ERROR',
      },
      { status: 500 },
    )
  }
}
