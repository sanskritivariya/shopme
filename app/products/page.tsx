'use client'

import { useState, useEffect } from 'react'
import {
  createProduct,
  createCategory,
  getAllCategories,
  getCategoriesByParent,
  getProductsByCategory,
  Product,
  Category,
} from '@/lib/data/products'
import { useAuth } from '@/contexts/AuthContext'
import { useIsAdmin } from '@/hooks/useRole'
import { getStoredUser } from '@/utils/auth'
import { Button } from '@/components/ui/Button'
import Sidebar from '@/components/admin/Sidebar'
import {
  uploadImage,
  uploadMultipleImages,
  generateImagePath,
} from '@/lib/utils/imageUpload'
import { uploadImageAsBase64 } from '@/lib/utils/base64Upload'

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<
    Record<string, Product[]>
  >({})
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  )
  const { userProfile, loading: authLoading, user } = useAuth()
  console.log('Auth state - userProfile:', userProfile, 'user:', user)
  const { isAdmin, loading: adminLoading } = useIsAdmin()
  console.log('Admin state - isAdmin:', isAdmin, 'loading:', adminLoading)

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: '',
    images: [] as string[],
    stock: '',
    status: 'active' as 'active' | 'inactive',
    sizes: [] as string[],
  })

  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [customSize, setCustomSize] = useState('')

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parentCategory: '',
    image: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const result = await getAllCategories()
    if (result.success) {
      setCategories(result.categories || [])
      // Fetch products for each category
      result.categories?.forEach(async (category) => {
        const productsResult = await getProductsByCategory(category.id!)
        if (productsResult.success) {
          setCategoryProducts((prev) => ({
            ...prev,
            [category.id!]: productsResult.products || [],
          }))
        }
      })
    }
    setLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    // Use localStorage user data if userProfile is null
    const currentUser = userProfile || getStoredUser()
    console.log('Current user for product creation:', currentUser)

    if (!currentUser?.uid) {
      alert('Please login first')
      return
    }

    setUploading(true)

    try {
      const productData: any = {
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        status: productForm.status,
        createdBy: currentUser.uid,
      }

      // Create product first to get ID
      console.log('Creating product with data:', productData)
      const tempResult = await createProduct(productData)
      console.log('Product creation result:', tempResult)

      if (!tempResult.success) {
        console.error('Product creation failed:', tempResult.error)
        throw new Error(tempResult.error || 'Failed to create product')
      }

      const productId = tempResult.id
      if (!productId) {
        throw new Error('Failed to get product ID')
      }
      const imagePath = generateImagePath(currentUser.uid, productId)

      // Upload main image if provided
      if (mainImageFile) {
        try {
          const mainImageUrl = await uploadImage(
            mainImageFile,
            `${imagePath}/main`,
          )
          productData.imageUrl = mainImageUrl
          console.log('Main image uploaded successfully:', mainImageUrl)
        } catch (imageError) {
          console.error(
            'Firebase Storage failed, using base64 fallback:',
            imageError,
          )
          try {
            // Fallback to base64 storage
            const base64Image = await uploadImageAsBase64(mainImageFile)
            productData.imageUrl = base64Image
            productData.imageType = 'base64' // Mark as base64 for display
            console.log('Main image stored as base64 successfully')
          } catch (base64Error) {
            console.error('Base64 fallback also failed:', base64Error)
            alert(
              'Warning: Product created but image upload failed completely.',
            )
          }
        }
      }

      // Upload additional images if provided
      if (additionalImageFiles.length > 0) {
        try {
          const additionalUrls = await uploadMultipleImages(
            additionalImageFiles,
            `${imagePath}/additional`,
          )
          productData.images = additionalUrls
          console.log(
            'Additional images uploaded successfully:',
            additionalUrls.length,
          )
        } catch (imageError) {
          console.error('Failed to upload additional images:', imageError)
          // Continue without images - product will still be created
          alert(
            'Warning: Product created but additional images upload failed. Please check Firebase Storage configuration.',
          )
        }
      }

      // Add sizes if provided
      if (productForm.sizes && productForm.sizes.length > 0) {
        productData.sizes = productForm.sizes
      }

      // Update product with image URLs
      const { updateProduct } = await import('@/lib/data/products')
      await updateProduct(productId, productData)

      // Refresh products for the selected category
      const productsResult = await getProductsByCategory(productForm.category)
      if (productsResult.success) {
        setCategoryProducts((prev) => ({
          ...prev,
          [productForm.category]: productsResult.products || [],
        }))
      }
      resetProductForm()
      setShowAddModal(false)
    } catch (error: any) {
      console.error('Error creating product:', error)
      alert('Failed to create product: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    const categoryData: any = {
      name: categoryForm.name,
      description: categoryForm.description,
    }

    // Only include parentCategory if it has a value
    if (categoryForm.parentCategory) {
      categoryData.parentCategory = categoryForm.parentCategory
    }

    // Only include image if it has a value
    if (categoryForm.image) {
      categoryData.image = categoryForm.image
    }

    const result = await createCategory(categoryData)
    if (result.success) {
      fetchCategories()
      resetCategoryForm()
      setShowCategoryModal(false)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
      images: [],
      stock: '',
      status: 'active',
      sizes: [],
    })
    setMainImageFile(null)
    setAdditionalImageFiles([])
    setCustomSize('')
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      parentCategory: '',
      image: '',
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex'>
        <Sidebar />
        <div className='flex-1 lg:ml-64 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
            <div className='mt-4 text-xs text-gray-500'>
              <p>Component Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
              <p>Admin Loading: {adminLoading ? 'Yes' : 'No'}</p>
              <p>User: {user ? 'Logged In' : 'Not Logged In'}</p>
              <p>User Profile: {userProfile ? 'Exists' : 'Null'}</p>
              <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <Sidebar />
      <div className='flex-1 lg:ml-64 p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Products & Categories
            </h1>
            <div className='mt-2 text-sm'>
              {isAdmin ? (
                <span className='text-green-600'>Admin: {user?.email}</span>
              ) : user ? (
                <span className='text-yellow-600'>
                  User (not admin): {user.email}
                </span>
              ) : (
                <span className='text-red-600'>Not logged in</span>
              )}
            </div>
          </div>
          <div className='flex gap-3'>
            <Button
              onClick={() => setShowCategoryModal(true)}
              className='bg-green-600 hover:bg-green-700'
            >
              Add Category
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className='bg-blue-600 hover:bg-blue-700'
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <div className='p-4 border-b bg-gray-50'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    {category.name}
                  </h3>
                  <button
                    onClick={() => toggleCategory(category.id!)}
                    className='text-blue-600 hover:text-blue-800'
                  >
                    {expandedCategories.has(category.id!) ? '▼' : '▶'}
                  </button>
                </div>
                <p className='text-sm text-gray-600 mt-1'>
                  {category.description}
                </p>
              </div>

              {expandedCategories.has(category.id!) && (
                <div className='p-4'>
                  <div className='space-y-3'>
                    {categoryProducts[category.id!]?.map((product) => (
                      <div
                        key={product.id}
                        className='border rounded-lg p-3 bg-gray-50'
                      >
                        <h4 className='font-medium text-gray-900'>
                          {product.name}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {product.description}
                        </p>
                        <div className='flex justify-between items-center mt-2'>
                          <span className='text-lg font-bold text-blue-600'>
                            ${product.price.toFixed(2)}
                          </span>
                          <span className='text-sm text-gray-500'>
                            Stock: {product.stock}
                          </span>
                        </div>
                        {product.sizes && product.sizes.length > 0 && (
                          <div className='flex flex-wrap gap-1 mt-2'>
                            {product.sizes.map((size) => (
                              <span
                                key={size}
                                className='inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded'
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {(!categoryProducts[category.id!] ||
                      categoryProducts[category.id!]?.length === 0) && (
                      <p className='text-gray-500 text-center py-4'>
                        No products in this category
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className='bg-white rounded-lg shadow-md p-12 text-center'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No categories found
            </h3>
            <p className='text-sm text-gray-500 mb-6'>
              Get started by adding your first product category.
            </p>
            <Button
              onClick={() => setShowCategoryModal(true)}
              className='bg-green-600 hover:bg-green-700'
            >
              Add Your First Category
            </Button>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
            <div className='relative top-20 mx-auto p-6 border w-[600px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Add New Product
              </h3>
              <form
                onSubmit={handleAddProduct}
                className='space-y-4'
              >
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product Name
                  </label>
                  <input
                    type='text'
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category
                  </label>
                  <select
                    required
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    <option value=''>Select a category</option>
                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id!}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Price
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Stock
                  </label>
                  <input
                    type='number'
                    required
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Main Image
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setMainImageFile(file)
                      }
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  {mainImageFile && (
                    <p className='mt-2 text-sm text-gray-600'>
                      Selected: {mainImageFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Additional Images
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setAdditionalImageFiles(files)
                    }}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  {additionalImageFiles.length > 0 && (
                    <p className='mt-2 text-sm text-gray-600'>
                      Selected: {additionalImageFiles.length} additional
                      image(s)
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Product Sizes
                  </label>
                  <div className='space-y-2'>
                    <div className='flex flex-wrap gap-2'>
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                          key={size}
                          type='button'
                          onClick={() => {
                            if (productForm.sizes.includes(size)) {
                              setProductForm({
                                ...productForm,
                                sizes: productForm.sizes.filter(
                                  (s) => s !== size,
                                ),
                              })
                            } else {
                              setProductForm({
                                ...productForm,
                                sizes: [...productForm.sizes, size],
                              })
                            }
                          }}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            productForm.sizes.includes(size)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    <div className='flex gap-2'>
                      <input
                        type='text'
                        placeholder='Custom size (e.g., US 8, EU 42)'
                        value={customSize}
                        onChange={(e) => setCustomSize(e.target.value)}
                        className='flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                      />
                      <button
                        type='button'
                        onClick={() => {
                          if (
                            customSize.trim() &&
                            !productForm.sizes.includes(customSize.trim())
                          ) {
                            setProductForm({
                              ...productForm,
                              sizes: [...productForm.sizes, customSize.trim()],
                            })
                            setCustomSize('')
                          }
                        }}
                        className='px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors'
                      >
                        Add
                      </button>
                    </div>

                    {productForm.sizes.length > 0 && (
                      <div className='flex flex-wrap gap-1 mt-2'>
                        {productForm.sizes.map((size) => (
                          <span
                            key={size}
                            className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                          >
                            {size}
                            <button
                              type='button'
                              onClick={() => {
                                setProductForm({
                                  ...productForm,
                                  sizes: productForm.sizes.filter(
                                    (s) => s !== size,
                                  ),
                                })
                              }}
                              className='ml-1 text-blue-600 hover:text-blue-800'
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex space-x-3'>
                  <Button
                    type='submit'
                    className='bg-blue-600 hover:bg-blue-700'
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Add Product'}
                  </Button>
                  <Button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-700'
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showCategoryModal && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
            <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Add New Category
              </h3>
              <form
                onSubmit={handleAddCategory}
                className='space-y-4'
              >
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category Name
                  </label>
                  <input
                    type='text'
                    required
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Parent Category (Optional)
                  </label>
                  <select
                    value={categoryForm.parentCategory}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        parentCategory: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  >
                    <option value=''>None (Main Category)</option>
                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id!}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>

                <div className='flex space-x-3'>
                  <Button
                    type='submit'
                    className='bg-green-600 hover:bg-green-700'
                  >
                    Add Category
                  </Button>
                  <Button
                    type='button'
                    onClick={() => setShowCategoryModal(false)}
                    className='bg-gray-300 hover:bg-gray-400 text-gray-700'
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
