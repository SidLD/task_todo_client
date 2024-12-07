'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Brain, Eye, EyeOff } from 'lucide-react' // Import the Eye and EyeOff icons
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"

import { LoginFormData, RegisterFormData } from "@/lib/interface"
import { useToast } from "@/hooks/use-toast"
import { login, register } from "@/lib/api"
import { auth } from "@/lib/services"
import { useNavigate } from "react-router-dom"

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  middleName: z.string().min(1, { message: "Middle name is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State for toggling password visibility
  const { toast } = useToast()
  const navigation = useNavigate()
  
  useEffect(() => {
    const user = auth.getRole()
    if(user == 'USER'){
      navigation('/user')
    }else if(user == "ADMIN"){
      navigation('/admin')
    }
  }, [])

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onLogin = async (data: LoginFormData) => {
    setLoading(true)
    try {
      login(data).then((res:any) => {
        console.log(res)
        if(res.data?.token){
          auth.storeToken(res.data.token)
          toast({
            title: "Login Successful",
            description: "Welcome back!, Navigating to Dashboard",
          })
          setTimeout(() => {
            const user = auth.getRole()
            if(user == 'USER'){
              navigation('/user')
            }else if(user == "ADMIN"){
              navigation('/admin')
            }
          }, 1000)
        }
      })
      .catch((err:any) => {
        toast({
          variant: 'destructive',
          title: "Login Failed",
          description: `${err.response.data.message}`,
        })
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      register(data).then((data) => {
        console.log(data)
        toast({
          title: "Register Successful",
          description: "Welcome new User!",
        })
      })
      .catch((err:any) => {
        toast({
          variant: 'destructive',
          title: "Registration Failed",
          description: `${err.response.data.message}`,
        })
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Brain className="w-10 h-10 text-teal-500" />
          <span className="ml-2 text-2xl font-bold text-gray-900">Smart Tracker</span>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      {...loginForm.register("email")}
                      className="border-teal-100 focus:ring-teal-500"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} // Toggle password visibility
                        {...loginForm.register("password")}
                        className="border-teal-100 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} // Toggle state on click
                        className="absolute text-teal-500 transform -translate-y-1/2 right-2 top-1/2"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your details to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m@example.com" 
                      {...registerForm.register("email")}
                      className="border-teal-100 focus:ring-teal-500"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      {...registerForm.register("firstName")}
                      className="border-teal-100 focus:ring-teal-500"
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      {...registerForm.register("lastName")}
                      className="border-teal-100 focus:ring-teal-500"
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input 
                      id="middleName" 
                      type="text" 
                      {...registerForm.register("middleName")}
                      className="border-teal-100 focus:ring-teal-500"
                    />
                    {registerForm.formState.errors.middleName && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.middleName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} // Toggle password visibility
                        {...registerForm.register("password")}
                        className="border-teal-100 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} // Toggle state on click
                        className="absolute text-teal-500 transform -translate-y-1/2 right-2 top-1/2"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}
