interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  gradientColors: string
  className?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradientColors,
  className = ''
}: FeatureCardProps) {
  return (
    <div className={`text-center p-6 bg-white/60 backdrop-blur rounded-2xl hover:bg-white/80 transition-all duration-200 transform hover:scale-105 ${className}`}>
      <div className={`w-16 h-16 bg-gradient-to-r ${gradientColors} rounded-full flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}
