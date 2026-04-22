'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthApi } from '@/lib/api/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check authentication and role
    if (!AuthApi.isAuthenticated() || !AuthApi.isUser()) {
      router.push('/login')
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = async () => {
    await AuthApi.logout()
    router.push('/login')
  }

  const menuItems = [
    {
      name: 'Products',
      href: '/user/products',
      icon: (
        <svg
          className='w-5 h-5'
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
      ),
    },
    {
      name: 'Cart',
      href: '/user/cart',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
          />
        </svg>
      ),
    },
    {
      name: 'Orders',
      href: '/user/orders',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
          />
        </svg>
      ),
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75 transition-opacity'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:flex lg:flex-col
      `}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b'>
          <h1 className='text-xl font-bold text-gray-800'>ShopHub</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden text-gray-500 hover:text-gray-700'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <nav className='flex-1 mt-6 overflow-y-auto'>
          <div className='px-3'>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className='mr-3'>{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className='border-t bg-white p-4 mt-auto'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200'
          >
            <svg
              className='w-5 h-5 mr-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col min-h-screen'>
        {/* Top bar */}
        <div className='bg-white shadow-sm border-b'>
          <div className='flex items-center justify-between h-16 px-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='lg:hidden text-gray-500 hover:text-gray-700'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>Welcome to ShopHub</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  )
}
