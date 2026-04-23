'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'user'
  fallbackPath?: string
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Not logged in
      if (!user) {
        router.push(fallbackPath)
        return
      }

      // Check role requirements
      if (requiredRole && userProfile?.role !== requiredRole) {
        if (userProfile?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        return
      }
    }
  }, [user, userProfile, loading, router, requiredRole, fallbackPath])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Don't render children if not authenticated or wrong role
  if (!user || (requiredRole && userProfile?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
