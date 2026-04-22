interface DecorativeElementsProps {
  className?: string
}

export default function DecorativeElements({
  className = '',
}: DecorativeElementsProps) {
  return (
    <>
      <div
        className={`absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ${className}`}
      ></div>
      <div className='absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000'></div>
    </>
  )
}
