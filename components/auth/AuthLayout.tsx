import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  gradientColors: string
  icon: React.ReactNode
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  gradientColors,
  icon 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${gradientColors} rounded-full mb-4 animate-bounce-slow`}>
            {icon}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  )
}
