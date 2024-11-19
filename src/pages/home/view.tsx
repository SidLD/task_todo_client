import { TextReveal } from '@/components/ui/typography'
import React from 'react'

const HomeView: React.FC = () => {
  return (
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-8 text-center">
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            <TextReveal> Be the Link, Be the Lifesaver.</TextReveal>
          </h1>
          <div className="flex flex-col grid-cols-1 gap-4 min-w-24 md:flex-row md: md:grid-cols-2">
            <a 
              href="/login" 
              className="shadow-lg rounded-3xl w-60 h-12 flex items-center justify-center text-lg font-medium bg-[#8d2727] hover:bg-[#2D0000] text-white transition-all  border border-[#500000] hover:shadow-xl hover:-translate-y-0.5"
              >
              LOG IN
            </a>
            <a 
              href="/register" 
              className="rounded-3xl w-60 h-12 flex items-center justify-center text-lg font-medium bg-[#8d2727] hover:bg-[#2D0000] text-white transition-all shadow-lg border border-[#500000] hover:shadow-xl hover:-translate-y-0.5"
              >
              CREATE ACCOUNT
            </a>
          </div>
        </div>
  )
}

export default HomeView