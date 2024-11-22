import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

interface RegisterPageProps {
  backgroundImageUrl?: string
}

const AdminLayout: React.FC<RegisterPageProps> = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <Toaster />
      <div className="absolute inset-0 bg-white">
        <img />
        <div className="absolute left-0 bottom-0 w-[20%] h-[15%] bg-[#8B0000] rounded-tr-full " />
        <div className="absolute right-0 top-0 w-[20%] h-[35%] bg-[#FF0000] rounded-bl-full" />
      </div>
      <div className="z-10 flex flex-col w-full max-w-4xl mx-4 overflow-hidden bg-white rounded-lg shadow-xl md:flex-row bg-opacity-90">
      <div className="grid w-full h-full rounded-lg"> 
        <Outlet />       
        </div>
      </div>
    </div>
  )
}

export default AdminLayout

