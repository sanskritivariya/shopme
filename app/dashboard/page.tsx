'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/admin/Sidebar'

export default function DashboardPage() {
  const { userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        router.push('/login')
      } else if (userProfile.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/user')
      }
    }
  }, [userProfile, loading, router])

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex'>
        <Sidebar />
      </div>
    )
  }

  return (
    <></>
    // <div className='min-h-screen flex items-center justify-center'>
    //   <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
    // </div>
  )
}
