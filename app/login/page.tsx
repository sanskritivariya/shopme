'use client'

import { useState } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'
import SocialLogin from '@/components/auth/SocialLogin'
import Link from 'next/link'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    console.log('Login data:', data)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000)
  }

  const icon = (
    <svg
      className='w-10 h-10 text-white'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M7 7h10v10H7z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12 2v6m0 4v6m0 4v-2'
      />
    </svg>
  )

  return (
    <AuthLayout
      title='StyleHub'
      subtitle='Your fashion destination'
      gradientColors='from-purple-600 to-pink-600'
      icon={icon}
    >
      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      {/* <SocialLogin /> */}
      <p className='mt-8 text-center text-sm text-gray-600'>
        Don't have an account?{' '}
        <Link
          href='/signup'
          className='font-medium text-purple-600 hover:text-purple-500 transition-colors'
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
