export const homeContent = {
  hero: {
    title: 'StyleHub',
    subtitle:
      'Discover the latest fashion trends and express your unique style with our curated collection',
    primaryButton: {
      text: 'Get Started',
      onClick: () => console.log('Navigate to signup'),
    },
    secondaryButton: {
      text: 'Sign In',
      onClick: () => console.log('Navigate to login'),
    },
  },
  features: [
    {
      id: 1,
      title: 'Curated Collections',
      description:
        'Hand-picked fashion items tailored to your style preferences',
      gradientColors: 'from-purple-500 to-pink-500',
      iconName: 'heart',
    },
    {
      id: 2,
      title: 'Trending Now',
      description: 'Stay ahead with the latest fashion trends and styles',
      gradientColors: 'from-blue-500 to-purple-500',
      iconName: 'lightning',
    },
    {
      id: 3,
      title: 'Personal Style',
      description: 'Express yourself with unique fashion combinations',
      gradientColors: 'from-pink-500 to-red-500',
      iconName: 'user',
    },
  ],
}
