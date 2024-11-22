import React from 'react'
import { User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import logo from '../../../assets/logo.png'

const AdminSignInView: React.FC = () => {
  return (
    <div className="grid w-full h-full rounded-lg lg:grid-cols-2">
      <div className="bg-[#3D0000] p-8 lg:p-12 flex flex-col min-h-[600px]">
        <div className="flex items-center text-white/90">
          <img width={60} src={logo} alt="logo" className="brightness-200" />
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 text-center">
          <h1 className="mb-8 text-3xl font-bold text-white">
            <span className="px-4 py-2 border-2 border-purple-500 rounded-lg bg-purple-500/10">
              Welcome Back!
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 px-6 py-3 mb-8 bg-white rounded-full">
            <User className="w-6 h-6 text-[#3D0000]" />
            <span className="text-xl font-bold text-[#3D0000]">ADMIN</span>
          </div>

          <form className="w-full max-w-md space-y-6">
            <Input 
              type="text"
              placeholder="Hospital"
              className="h-14 bg-white border-none rounded-full text-[#3D0000] placeholder:text-[#3D0000]/70 px-6"
            />
            <Input 
              type="text"
              placeholder="License ID"
              className="h-14 bg-white border-none rounded-full text-[#3D0000] placeholder:text-[#3D0000]/70 px-6"
            />
            <Button 
              className="w-full h-14 text-xl font-bold text-[#3D0000] bg-white hover:bg-white/90 rounded-full mt-8"
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
      
      {/* Right side panel - can be removed or modified based on your needs */}
      <div className="hidden lg:flex bg-[#F5F5F5] p-12 flex-col items-center justify-center text-center">
        <h2 className="mb-2 text-2xl font-bold text-[#3D0000]">
          New Here?
        </h2>
        <p className="mb-6 text-[#3D0000]/70">
          Sign up and discover great opportunities
        </p>
        <Button 
          variant="outline"
          className="border-[#3D0000] text-[#3D0000] hover:bg-[#3D0000] rounded-full hover:text-white"
        >
          Register
        </Button>
      </div>
    </div>
  )
}

export default AdminSignInView

