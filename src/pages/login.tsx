'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { LoginFormData } from '@/lib/interface'
import { SignUpModal } from './signup'
import { login } from '@/lib/api'
import { auth } from '@/lib/services'


export default function LoginPage() {
  const router = useNavigate()
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: ''
  })

  useEffect(() => {
    if(auth.getToken()){
      router('/user')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(loginData)
      .then((data:any) => {
        if(data.data){
          auth.storeToken(data.data.token)
          router('/user')
        }
      })
      .catch((err:any) => {
        console.log(err)
      })
    } catch (error) {
      
    }
  }

  return (
    <div className="min-h-screen bg-[#dfbe51] flex flex-col">
      <header className="w-full bg-[#e2af42] py-5 text-center">
        <h1 className="text-2xl font-bold text-black">DAILY FINANCES</h1>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-grow">
        <form className="w-full max-w-md space-y-4">
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
            <Button onClick={handleSubmit} type="submit" className="w-36 h-12 bg-[#8f6b07] hover:bg-[#dab641] text-white rounded-lg">
              Login
            </Button>
            <SignUpModal />
          </div>
        </form>
      </main>
    </div>
  )
}

