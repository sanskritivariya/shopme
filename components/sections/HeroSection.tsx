'use client'

import Link from 'next/link'
import { Button } from '../ui/Button'

interface HeroButton {
  text: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

interface HeroSectionProps {
  title: string
  subtitle: string
  primaryButton: HeroButton
  secondaryButton: HeroButton
  className?: string
}

export default function HeroSection({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  className = '',
}: HeroSectionProps) {
  return (
    <div className={`text-center animate-fade-in ${className}`}>
      <h1 className='text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6'>
        {title}
      </h1>

      <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto'>
        {subtitle}
      </p>

      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        {primaryButton.href ? (
          <Link href={primaryButton.href}>
            <Button className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors duration-200'>
              {primaryButton.text}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={primaryButton.onClick}
            className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-colors duration-200'
          >
            {primaryButton.text}
          </Button>
        )}

        {secondaryButton.href ? (
          <Link href={secondaryButton.href}>
            <Button className='cursor-pointer bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-50 transition-colors duration-200'>
              {secondaryButton.text}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={secondaryButton.onClick}
            className='cursor-pointer bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-full hover:bg-gray-50 transition-colors duration-200'
          >
            {secondaryButton.text}
          </Button>
        )}
      </div>
    </div>
  )
}
