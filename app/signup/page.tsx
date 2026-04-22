'use client'

import { useState } from 'react'
import AuthLayout from '@/components/auth/AuthLayout'
import SignupForm from '@/components/auth/SignupForm'
import SocialLogin from '@/components/auth/SocialLogin'
import Link from 'next/link'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    setIsLoading(true)
    console.log('Signup data:', data)
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
        d='M12 4v16m8-8H4'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M7 7h10v10H7z'
      />
    </svg>
  )

  return (
    <AuthLayout
      title='Join StyleHub'
      subtitle='Start your fashion journey'
      gradientColors='from-blue-600 to-purple-600'
      icon={icon}
    >
      <SignupForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      {/* <SocialLogin /> */}
      <p className='mt-8 text-center text-sm text-gray-600'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
