// Shared product data store for API routes

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  sizes: string[]
  category: string
  stock: number
  createdAt: string
  updatedAt: string
}

// Mock product data - shared across all API routes
export let products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    description: 'Comfortable and stylish white t-shirt made from premium cotton',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'clothing',
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans with modern styling',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    sizes: ['28', '30', '32', '34', '36'],
    category: 'clothing',
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Leather Jacket',
    description: 'Premium leather jacket with a modern cut',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1551024601-b1d8c7b8c6e8?w=500',
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'clothing',
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]
