'use client'

import { useState, useEffect } from 'react'
import { ProductApi } from '@/lib/api/client'

interface Product {
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

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await ProductApi.getProducts()
      if (response.success) {
        setProducts(response.data as Product[])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    console.log('Delete button clicked for product:', id)
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      console.log('Calling delete API for product:', id)
      const response = await ProductApi.deleteProduct(id)
      console.log('Delete API response:', response)
      if (response.success) {
        console.log('Delete successful, updating state')
        setProducts(products.filter((p) => p.id !== id))
        // Show success message
        alert('Product deleted successfully!')
      } else {
        console.error('Delete failed:', response.message)
        alert(`Failed to delete product: ${response.message}`)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
        <button
          onClick={() => {
            console.log('Add product button clicked')
            setShowAddModal(true)
          }}
          className='bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
          />
          <svg
            className='absolute left-3 top-2.5 w-5 h-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Product
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Stock
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Category
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className='hover:bg-gray-50 transition-colors duration-150'
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <img
                        className='h-10 w-10 rounded-lg object-cover'
                        src={product.image}
                        alt={product.name}
                      />
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {product.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {product.sizes.join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      ${product.price.toFixed(2)}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 20
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 10
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900 capitalize'>
                      {product.category}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <button
                      onClick={() => handleEdit(product)}
                      className='text-purple-600 hover:text-purple-900 mr-3 transition-colors duration-150'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className='text-red-600 hover:text-red-900 transition-colors duration-150'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className='text-center py-8'>
            <svg
              className='w-16 h-16 text-gray-400 mx-auto mb-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
            <p className='text-gray-500'>No products found</p>
            <p className='text-sm text-gray-400 mt-2'>
              Get started by adding your first product
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false)
            setEditingProduct(null)
          }}
          onSave={(productData) => {
            if (editingProduct) {
              // Update existing product
              ProductApi.updateProduct(editingProduct.id, productData).then(
                (response) => {
                  if (response.success) {
                    fetchProducts()
                    setEditingProduct(null)
                  }
                },
              )
            } else {
              // Add new product
              ProductApi.createProduct(productData).then((response) => {
                if (response.success) {
                  fetchProducts()
                  setShowAddModal(false)
                }
              })
            }
          }}
        />
      )}
    </div>
  )
}

// Product Modal Component
interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onSave: (productData: any) => void
}

function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  console.log('ProductModal rendering, product:', product)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    image: product?.image || '',
    sizes: product?.sizes.join(', ') || '',
    category: product?.category || 'clothing',
    stock: product?.stock?.toString() || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sizes: formData.sizes
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s),
      }

      await onSave(productData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50'
          onClick={onClose}
        ></div>

        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
          &#8203;
        </span>

        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 relative'>
          <form onSubmit={handleSubmit}>
            <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                {product ? 'Edit Product' : 'Add New Product'}
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Name
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Price
                    </label>
                    <input
                      type='number'
                      step='0.01'
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Stock
                    </label>
                    <input
                      type='number'
                      required
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Image URL
                  </label>
                  <input
                    type='url'
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Sizes (comma-separated)
                  </label>
                  <input
                    type='text'
                    value={formData.sizes}
                    onChange={(e) =>
                      setFormData({ ...formData, sizes: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                    placeholder='S, M, L, XL'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm'
                  >
                    <option value='clothing'>Clothing</option>
                    <option value='electronics'>Electronics</option>
                    <option value='accessories'>Accessories</option>
                    <option value='shoes'>Shoes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
              <button
                type='submit'
                disabled={loading}
                className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50'
              >
                {loading ? 'Saving...' : product ? 'Update' : 'Create'}
              </button>
              <button
                type='button'
                onClick={onClose}
                className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
