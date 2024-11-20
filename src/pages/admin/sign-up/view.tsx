import React from 'react'
import { User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import logo from '../../../assets/logo.png'

const AdminSignUpView: React.FC = () => {
  return (
    <div className="relative grid h-full rounded-lg lg:grid-cols-2">
      <div className=" bg-[#3D0000] p-4 lg:p-6 flex flex-col lg:min-h-[45rem]">
            <div className="relative z-20 flex items-center text-white/90">
                <img width={60} src={logo} alt="logo" />
            </div>
        
        <div className='flex justify-center w-full'>
          <div className="flex items-center justify-center gap-2 px-4 py-2 mb-8 rounded-lg w-fit bg-white/90">
            <User className="w-5 h-5 text-[#3D0000]" />
            <span className="font-bold text-[#3D0000]">ADMIN</span>
          </div>
        </div>
        <form className="flex-1 px-12 space-y-6">
          <div>
            <Input 
              type="text"
              placeholder="Name"
              className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
          </div>
          <div>
            <Input 
              type="text"
              placeholder="Hospital/Workplace"
              className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
          </div>
          <div>
            <Input 
              type="text"
              placeholder="License ID"
              className="bg-white border-none h-12 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
          </div>
          <Button 
            className="w-full bg-white hover:bg-white/90 text-[#3D0000] font-bold h-12 text-lg"
          >
            Register
          </Button>
        </form>
      </div>
      <div className="bg-[#F5F5F5] p-8 lg:p-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-[#3D0000] mb-2">
          Welcome Back!
        </h1>
        <p className="text-[#3D0000]/70 mb-6">
          Link in to access important details.
        </p>
        <Button 
          variant="outline"
          className="border-[#3D0000] text-[#3D0000] hover:bg-[#3D0000] rounded-3xl  hover:text-white"
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default AdminSignUpView