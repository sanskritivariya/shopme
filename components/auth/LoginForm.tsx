'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { AuthApi } from '@/lib/api/client'

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void
  isLoading?: boolean
}

export default function LoginForm({
  onSubmit,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        onSubmit({ email, password })
      } else {
        // Use the new API client
        const response = await AuthApi.login({ email, password })

        if (response.success) {
          // Redirect based on user role
          const userRole = response.data?.user?.role
          if (userRole === 'admin') {
            router.push('/admin/dashboard')
          } else {
            router.push('/user/products')
          }
        } else {
          setError(response.message || 'Login failed')
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email
          </label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur'
            placeholder='Enter your email'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Password
          </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur'
            placeholder='Enter your password'
            required
          />
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <label className='flex items-center'>
          <input
            type='checkbox'
            className='w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500'
          />
          <span className='ml-2 text-sm text-gray-600'>Remember me</span>
        </label>
        <a
          href='#'
          className='text-sm text-purple-600 hover:text-purple-500 transition-colors'
        >
          Forgot password?
        </a>
      </div>

      <Button
        type='submit'
        disabled={isLoading || isSubmitting}
        className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100'
      >
        {isLoading || isSubmitting ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </Button>
    </form>
  )
}
