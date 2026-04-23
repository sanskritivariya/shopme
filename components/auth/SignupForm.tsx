'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface SignupFormProps {
  onSubmit?: (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => void
  isLoading?: boolean
}

export default function SignupForm({
  onSubmit,
  isLoading = false,
}: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        onSubmit(formData)
      } else {
        // Design-only form - no API calls
        console.log('Signup form submitted:', formData)
        // You can add custom logic here if needed
      }
    } catch (error: any) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Full Name
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur'
            placeholder='Enter your full name'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur'
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
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur'
            placeholder='Create a password'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Confirm Password
          </label>
          <input
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur'
            placeholder='Confirm your password'
            required
          />
        </div>
      </div>

      <div className='flex items-center'>
        <input
          type='checkbox'
          className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
          required
        />
        <span className='ml-2 text-sm text-gray-600'>
          I agree to the{' '}
          <a
            href='#'
            className='text-blue-600 hover:text-blue-500 transition-colors'
          >
            Terms & Conditions
          </a>
        </span>
      </div>

      <Button
        type='submit'
        disabled={isLoading || isSubmitting}
        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100'
      >
        {isLoading || isSubmitting ? (
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  )
}
