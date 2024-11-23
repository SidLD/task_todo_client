'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { SignUpModal } from './signup'


export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function LoginPage() {
  const router = useNavigate()
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login data:', loginData)
    // Redirect to dashboard after successful login
    router('/user')
  }

  return (
    <div className="min-h-screen bg-[#dfbe51] flex flex-col">
      <header className="w-full bg-[#e2af42] py-5 text-center">
        <h1 className="text-2xl font-bold text-black">DAILY FINANCES</h1>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-grow">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            className="h-12 rounded-lg bg-[#f0f0f0] text-black"
            required
          />
          
          <Input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            className="h-12 rounded-lg bg-[#f0f0f0] text-black"
            required
          />
          
          <div className="flex justify-center space-x-4">
            <Button type="submit" className="w-36 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
              Login
            </Button>
            <SignUpModal />
          </div>
        </form>
      </main>
    </div>
  )
}

