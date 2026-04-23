'use client'

import { useState, useEffect } from 'react'
import {
  getAllProducts,
  getAllCategories,
  Product,
  Category,
} from '@/lib/data/products'
import { useAuth } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { userProfile } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ])

        if (productsResult?.success) {
          setProducts(productsResult.products || [])
        }

        if (categoriesResult?.success) {
          setCategories(categoriesResult.categories || [])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ✅ Safe stats calculation
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p?.status === 'active').length,
    totalCategories: categories.length,
    totalStock: products.reduce((sum, p) => sum + (p?.stock || 0), 0),
  }

  if (loading) {
    return (
      <div className='fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50'>
        <div className='bg-white rounded-lg p-8 shadow-xl'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            <p className='text-gray-600 font-medium'>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <AdminSidebar />

      {/* Main Content */}
      <div className='flex-1 lg:ml-64 p-6 space-y-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
          <p className='text-gray-600 mt-1'>
            Welcome back, {userProfile?.name || 'Admin'}
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <StatCard
            title='Total Products'
            value={stats.totalProducts}
          />
          <StatCard
            title='Active Products'
            value={stats.activeProducts}
          />
          <StatCard
            title='Categories'
            value={stats.totalCategories}
          />
          <StatCard
            title='Total Stock'
            value={stats.totalStock}
          />
        </div>

        {/* Table */}
        <div className='bg-white rounded-lg shadow'>
          <div className='px-6 py-4 border-b'>
            <h2 className='text-lg font-semibold'>Recent Products</h2>
          </div>

          <div className='p-6 overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status'].map(
                    (h) => (
                      <th
                        key={h}
                        className='px-6 py-3 text-left text-xs text-gray-500 uppercase'
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody className='divide-y'>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className='px-6 py-4'>{product?.name}</td>
                    <td className='px-6 py-4'>{product?.category}</td>
                    <td className='px-6 py-4'>
                      ${Number(product?.price || 0).toFixed(2)}
                    </td>
                    <td className='px-6 py-4'>{product?.stock || 0}</td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 text-xs rounded-full ${
                          product?.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product?.status || 'inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {products.length === 0 && (
              <p className='text-center py-6 text-gray-500'>No products yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Reusable Stat Card
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <p className='text-sm text-gray-600'>{title}</p>
      <p className='text-2xl font-semibold text-gray-900'>{value}</p>
    </div>
  )
}
