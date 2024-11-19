import { Outlet } from "react-router-dom"
import logo from '../assets/logo.png'
import background from '../assets/full-background.png'

export default function GuestLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-t from-black to-transparent bg-[#4b0c0c] flex flex-col p-6 relative">
      <img 
        src={background} 
        alt="background"
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />

      <div className="relative z-20 flex items-center text-white/90">
        <img width={60}  src={logo} alt="logo" />
        <span className="text-2xl font-bold">
          {['B', 'L', 'O', 'O', 'D'].map(data => 
            <span className="transition-all duration-300 ease-in-out hover:text-red-600 hover:scale-105">{data}</span>)}
        </span>
        <span className="ml-2 text-sm font-bold">
        {[ 'L', 'i', 'n', 'k'].map(data => 
            <span className="transition-all duration-300 ease-in-out hover:text-red-600 hover:scale-105">{data}</span>)}
        </span>
      </div>
      <Outlet />
    </main>
  )
}
