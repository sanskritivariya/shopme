'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (onSubmit) {
        onSubmit({ email, password })
      } else {
        const result = await login(email, password)

        console.log('Login result:', result) // Debug log

        if (result.success) {
          console.log('Redirecting to dashboard') // Debug log
          router.push('/dashboard')
        } else {
          setError(result.error || 'Login failed')
        }
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
      setError(error.message || 'An error occurred during login')
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
