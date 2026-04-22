'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthApi } from '@/lib/api/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
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
    if (!AuthApi.isAuthenticated() || !AuthApi.isAdmin()) {
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
      name: 'Dashboard',
      href: '/admin/dashboard',
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
            d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
          />
        </svg>
      ),
    },
    {
      name: 'Products',
      href: '/admin/products',
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
      name: 'Users',
      href: '/admin/users',
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
            d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
          />
        </svg>
      ),
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600'></div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 flex'>
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:flex-shrink-0
      `}
      >
        <div className='flex items-center justify-between h-16 px-6 border-b'>
          <h1 className='text-xl font-bold text-gray-800'>Admin Panel</h1>
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

        <nav className='mt-6 pb-20'>
          <div className='px-4'>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px]
                    ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 border-r-2 border-purple-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className='flex-shrink-0 mr-3'>{item.icon}</span>
                  <span className='flex-1'>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className='absolute bottom-0 left-0 right-0 p-4 border-t bg-white'>
          <button
            onClick={handleLogout}
            className='w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 min-h-[44px]'
          >
            <svg
              className='w-5 h-5 flex-shrink-0 mr-3'
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
            <span className='flex-1'>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col'>
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
              <span className='text-sm text-gray-600'>Admin Dashboard</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  )
}
