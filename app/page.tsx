'use client'
import { useState } from 'react'
import HeroSection from '@/components/sections/HeroSection'
import FeatureCard from '@/components/sections/FeatureCard'
import DecorativeElements from '@/components/sections/DecorativeElements'
import { homeContent } from '@/data/homeContent'
import { iconMap } from '@/components/icons/FeatureIcons'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const { hero, features } = homeContent

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleGetStarted = () => {
    router.push('/signup')
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
          <HeroSection
            title={hero.title}
            subtitle={hero.subtitle}
            primaryButton={{
              text: hero.primaryButton.text,
              onClick: handleGetStarted,
            }}
            secondaryButton={{
              text: hero.secondaryButton.text,
              onClick: handleSignIn,
            }}
          />
        </div>
        <DecorativeElements />
      </div>

      {/* Features Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid md:grid-cols-3 gap-8'>
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              gradientColors={feature.gradientColors}
              icon={iconMap[feature.iconName as keyof typeof iconMap]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
