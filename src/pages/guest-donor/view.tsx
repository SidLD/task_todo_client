'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home } from 'lucide-react'

interface FormData {
  name: string
  address: string
  age: string
  sex: string
  phone: string
  email: string
  medicalCondition: string
}

export default function GuestDonorView() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    age: '',
    sex: '',
    phone: '',
    email: '',
    medicalCondition: ''
  })

  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  const dates = ['4', '5', '8', '10', '23', '27', '28', '30', '31']
  const times = ['8:00 AM', '8:45 AM', '9:20 AM', '1:00 PM']

  const handleNext = () => {
    setStep(prev => (prev + 1) as 1 | 2 | 3)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="text-black bg-white"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                className="text-black bg-white"
                placeholder="Enter your address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  className="text-black bg-white"
                  placeholder="Age"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sex</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sex"
                      value="F"
                      className="w-4 h-4 text-black"
                      checked={formData.sex === 'F'}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    />
                    <span>F</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sex"
                      value="M"
                      className="w-4 h-4 text-black"
                      checked={formData.sex === 'M'}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                    />
                    <span>M</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Cellphone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="text-black bg-white"
                placeholder="Enter your cellphone number"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="text-black bg-white"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Do you have any medical condition?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="medical"
                    value="Yes"
                    className="w-4 h-4 text-black"
                    checked={formData.medicalCondition === 'Yes'}
                    onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="medical"
                    value="No"
                    className="w-4 h-4"
                    checked={formData.medicalCondition === 'No'}
                    onChange={(e) => setFormData({ ...formData, medicalCondition: e.target.value })}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <Button type="submit" className="w-full bg-white text-[#591C1C] hover:bg-white/90">
              Next
            </Button>
          </form>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {dates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "secondary" : "outline"}
                  className={`rounded-full aspect-square ${
                    selectedDate === date ? 'bg-white text-[#591C1C]' : 'bg-transparent text-white'
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {times.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "secondary" : "outline"}
                  className={`rounded-full ${
                    selectedTime === time ? 'bg-white text-[#591C1C]' : 'bg-transparent text-white'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Choose a credited Hospital</Label>
              <Select>
                <SelectTrigger className="w-full bg-white text-[#591C1C]">
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calbayog">Calbayog District Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleNext}
              className="w-full bg-white text-[#591C1C] hover:bg-white/90"
            >
              Confirm
            </Button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-3xl font-bold">Thank you!</h2>
            <p className="text-white/90">
              Please view your email/messages for the reminders before your scheduled screening. 
              You may register in the website after receiving your Donor ID.
            </p>
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full">
                <Home className="w-12 h-12 text-[#591C1C]" />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative grid min-h-screen md:grid-cols-2">
      <div className="bg-[#591C1C] p-6 text-white">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold uppercase">Donor Applicant</h2>
          </div>
          <p className="text-sm text-center text-white/80">
            {step === 1 ? "Let's schedule your screening!" : 
             step === 2 ? "Choose Date & Time" : ""}
          </p>
          {renderStep()}
        </div>
      </div>
      <div className="bg-[#F8EFEF] p-6 flex flex-col items-center justify-center gap-4">
        <h2 className="text-[#591C1C] text-2xl">Welcome Back!</h2>
        <Button
          variant="outline"
          className="border-[#591C1C] text-[#591C1C] hover:bg-[#591C1C] hover:text-white"
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}