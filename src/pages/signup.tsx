'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SignUpFormData } from '@/lib/interface'
import { register } from '@/lib/api'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'


export function SignUpModal() {
  const {toast} = useToast()
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if(! (formData.password == formData.confirmPassword)){
        toast({
          variant: 'destructive',
          title: "Password does not match ",
          description: ''
        })
      }else{    
          await register(formData)
            .then((data:any) => {
              toast({
                title: "Sign Up Success ",
              })
            })
            .catch((err:any) => {
              toast({
                variant: 'destructive',
                title: "Sign Up Failed ",
                description: 'Username already used'
              })
            })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog>
      <Toaster />
      <DialogTrigger asChild>
        <Button className="w-36 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px] bg-[#f0f0f0] rounded-[15px]">
        <form onSubmit={handleSubmitRegistration} className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-black">Sign Up</h2>
          <Input
            placeholder="Create Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="h-12 rounded-lg bg-[#f0f0f0] text-black"
            required
          />
          <Input
            type="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="h-12 rounded-lg bg-[#f0f0f0] text-black"
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="h-12 rounded-lg bg-[#f0f0f0] text-black"
            required
          />
          <div className="flex justify-center space-x-4">
            <Button type="submit" className="w-24 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
              Sign Up
            </Button>
            <DialogTrigger asChild>
              <Button type="button" className="w-24 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
                Exit
              </Button>
            </DialogTrigger>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

