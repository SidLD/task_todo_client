import React from 'react'
import { User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import logo from '../../../assets/logo.png'
import { useToast } from '@/hooks/use-toast'

interface IFormInput {
  name: string;
  address: string;
  cellphoneNumber: string;
  donorId: string;
}

const DonorSignUpView: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<IFormInput>()
  const { toast } = useToast()

  const onSubmit: SubmitHandler<IFormInput> = async (_data) => {
    try {
      throw "err";
      // const response = await axios.post('https://your-api-endpoint.com/register', data)
      // toast({
      //   title: "Registration Successful",
      //   description: "You have successfully registered as a donor.",
      // })
      // console.log(response.data)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error during registration. Please try again.",
        variant: "destructive",
      })
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="grid w-full h-full rounded-lg lg:grid-cols-2">
      <div className="bg-[#3D0000] p-4 lg:p-6 flex flex-col lg:min-h-[25rem]">
        <div className="z-20 flex items-center text-white/90">
          <img width={60} src={logo} alt="logo" />
        </div>
        
        <div className='flex justify-center w-full'>
          <div className="flex items-center justify-center gap-2 px-4 py-2 mb-8 rounded-lg w-fit bg-white/90">
            <User className="w-5 h-5 text-[#3D0000]" />
            <span className="font-bold text-[#3D0000]">DONOR</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-12 space-y-4">
          <div>
            <Input 
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Name"
              className="bg-white border-none h-10 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Input 
              {...register("address", { required: "Address is required" })}
              type="text"
              placeholder="Address"
              className="bg-white border-none h-10 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
          </div>
          <div>
            <Input 
              {...register("cellphoneNumber", { 
                required: "Cellphone Number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid cellphone number"
                }
              })}
              type="text"
              placeholder="Cellphone Number"
              className="bg-white border-none h-10 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
            {errors.cellphoneNumber && <p className="mt-1 text-sm text-red-500">{errors.cellphoneNumber.message}</p>}
          </div>
          <div>
            <Input 
              {...register("donorId", { required: "Donor ID is required" })}
              type="text"
              placeholder="Donor ID"
              className="bg-white border-none h-10 text-[#3D0000] placeholder:text-[#3D0000]/70"
            />
            {errors.donorId && <p className="mt-1 text-sm text-red-500">{errors.donorId.message}</p>}
          </div>
          <Button 
            type="submit"
            className="w-full bg-white hover:bg-white/90 text-[#3D0000] font-bold h-12 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
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
          className="border-[#3D0000] text-[#3D0000] hover:bg-[#3D0000] rounded-3xl hover:text-white"
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default DonorSignUpView

