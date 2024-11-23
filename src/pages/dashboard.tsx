import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/services'
import { getBudget, getExpenses, setBudget, addExpense } from '@/lib/api'

export default function Dashboard() {
  const router = useNavigate()
  const [activeTab, setActiveTab] = useState('about')
  const user = auth.getUserInfo();
  const [budget, setBudgetState] = useState<number | null>(null)
  const [expenses, setExpensesState] = useState<any[]>([]) // Adjust according to your expense structure
  const [newBudget, setNewBudget] = useState<number>(0)
  const [expenseAmount, setExpenseAmount] = useState(0)

  useEffect(() => {
    if (!auth.getToken()) {
      router('/')
    } else {
      // Fetch the initial data when the component mounts
      fetchBudget()
      fetchExpenses()
    }
  }, [])

  // Function to handle logout
  const handleLogout = () => {
    try {
      auth.clear()
      router('/')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  // Fetch the budget from the API
  const fetchBudget = async () => {
    try {
      if (user.id) {
        const data = await getBudget(user.id) as unknown as any
        if (data.data) {
          setBudgetState(data.data.balance) // Set the current budget
        }
      }
    } catch (error) {
      console.error('Error fetching budget', error)
    }
  }

  // Fetch the list of expenses from the API
  const fetchExpenses = async () => {
    try {
      if (user.id) {
        const data = await getExpenses(user.id)  as unknown as any
        if (data.data) {
          setExpensesState(data.data) // Set the expenses state
        }
      }
    } catch (error) {
      console.error('Error fetching expenses', error)
    }
  }

  // Handle setting the budget
  const handleSetBudget = async () => {
    try {
      if (user.id && newBudget) {
        const response = await setBudget(user.id, newBudget)  as unknown as any
        if (response.data) {
          await fetchBudget()
        } else {
          console.error('Failed to set budget')
        }
      }
    } catch (error) {
      console.error('Error setting budget:', error)
    }
  }

  // Handle adding an expense
  const handleAddExpense = async () => {
    try {
      if (user.id  && expenseAmount > 0) {
        const response = await addExpense(user.id, expenseAmount)  as unknown as any
        if (response.data) {
         await fetchExpenses() // Refetch the expenses after adding a new one=
          setExpenseAmount(0)
          console.log('Expense added successfully:', response.data)
        } else {
          console.error('Failed to add expense')
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error)
    }
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
                  <div className="space-y-4">
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(Number(e.target.value))}
                      className="p-2 border rounded"
                      placeholder="Amount"
                    />
                    <Button onClick={handleAddExpense}>Add Expense</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list-expenses" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="mb-4 text-4xl font-bold">List of Expenses</h2>
                  <ul className="space-y-4">
                    {expenses.map((expense, index) => (
                      <li key={index} className="p-4 bg-white rounded-lg shadow-md">
                        <p>{expense.value}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="h-full m-0">
                <div className="flex flex-col items-center justify-center h-full">
                  <h2 className="mb-4 text-4xl font-bold">Budget</h2>
                  <div className="space-y-4">
                    <p>Current Budget: {budget !== null ? `$${budget}` : 'Not set'}</p>
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(Number(e.target.value))}
                      className="p-2 border rounded"
                      placeholder="Set new budget"
                    />
                    <Button onClick={handleSetBudget}>Set Budget</Button>
                  </div>
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
