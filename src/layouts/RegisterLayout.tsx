import { Outlet } from "react-router-dom"
import background from '../assets/background2.png'


export default function RegisterLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-t from-black to-transparent bg-[#4b0c0c]  p-16 overflow-hidden">
      <img 
        src={background} 
        alt="background"
        className="absolute inset-0 z-0 object-cover w-full h-full"
      />
        <Outlet />
    </main>
  )
}
