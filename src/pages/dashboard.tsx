'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const router = useNavigate()
  const [activeTab, setActiveTab] = useState('about')

  const handleLogout = () => {
    // Add logout logic here
    router('/')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#F5E6C3] p-4">
        <h1 className="text-4xl font-bold text-center">Daily Finances</h1>
      </header>

      <div className="flex flex-1">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="flex flex-1"
        >
          <TabsList className="flex flex-col h-full w-64 space-y-4 bg-[#F4D03F] p-4">
            <TabsTrigger
              value="about"
              className="w-full h-12 rounded-lg data-[state=active]:bg-[#FF6B6B] data-[state=active]:text-white"
            >
              ABOUT
            </TabsTrigger>
            <TabsTrigger
              value="add-expenses"
              className="w-full h-12 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5]"
            >
              ADD EXPENSES
            </TabsTrigger>
            <TabsTrigger
              value="list-expenses"
              className="w-full h-12 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5]"
            >
              LIST OF EXPENSES
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="w-full h-12 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5]"
            >
              BUDGET
            </TabsTrigger>
            <TabsTrigger
              value="reset"
              className="w-full h-12 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5]"
            >
              RESET
            </TabsTrigger>
            <Button
              onClick={handleLogout}
              className="w-full h-12 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5]"
            >
              Logout
            </Button>
          </TabsList>

          <div className="flex-1 bg-[#DEB887] p-8">
            <Card className="h-full bg-[#FFF8DC] p-8">
              <TabsContent value="about" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <h2 className="text-4xl font-bold">About</h2>
                  <p className="text-2xl text-center">
                    This website will help you track your daily finances.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="add-expenses" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="mb-4 text-4xl font-bold">Add Expenses</h2>
                  {/* Add expense form will go here */}
                </div>
              </TabsContent>

              <TabsContent value="list-expenses" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="mb-4 text-4xl font-bold">List of Expenses</h2>
                  {/* Expenses list will go here */}
                </div>
              </TabsContent>

              <TabsContent value="budget" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="mb-4 text-4xl font-bold">Budget</h2>
                  {/* Budget information will go here */}
                </div>
              </TabsContent>

              <TabsContent value="reset" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="mb-4 text-4xl font-bold">Reset</h2>
                  {/* Reset options will go here */}
                </div>
              </TabsContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

