'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


export interface LoginFormData {
    username: string;
    password: string;
  }
  
  export interface SignUpFormData {
    username: string;
    password: string;
    confirmPassword: string;
  }
  

export function SignUpModal() {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up data:', formData)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-36 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px] bg-[#f0f0f0] rounded-[15px]">
        <form onSubmit={handleSubmit} className="space-y-4">
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

