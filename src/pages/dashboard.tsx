import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/lib/services'
import { getBudget, getExpenses, setBudget, addExpense, resetExpenses } from '@/lib/api'

export default function Dashboard() {
  const router = useNavigate()
  const [activeTab, setActiveTab] = useState('about')
  const user = auth.getUserInfo()
  const [budget, setBudgetState] = useState<number | null>(null)
  const [expenses, setExpensesState] = useState<any[]>([])
  const [newBudget, setNewBudget] = useState<number>(0)
  const [expenseAmount, setExpenseAmount] = useState(0)
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    if (!auth.getToken()) {
      router('/')
    } else {
      fetchBudget()
      fetchExpenses()
    }
  }, [])

  const handleLogout = () => {
    try {
      auth.clear()
      router('/')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const fetchBudget = async () => {
    try {
      if (user.id) {
        const data = await getBudget(user.id) as unknown as any
        if (data.data) {
          setBudgetState(data.data.budget)
        }
      }
    } catch (error) {
      console.error('Error fetching budget', error)
    }
  }

  const fetchExpenses = async () => {
    try {
      if (user.id) {
        const data = await getExpenses(user.id) as unknown as any
        if (data.data) {
          setExpensesState(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching expenses', error)
    }
  }

  const handleSetBudget = async () => {
    try {
      if (user.id && newBudget) {
        const response = await setBudget(user.id, newBudget) as unknown as any
        if (response.data) {
          await fetchBudget()
          setNewBudget(0)
        }
      }
    } catch (error) {
      console.error('Error setting budget:', error)
    }
  }

  const handleAddExpense = async () => {
    try {
      if (user.id && expenseAmount > 0) {
        const response = await addExpense(user.id, expenseAmount, expenseDescription, new Date(expenseDate)) as unknown as any
        if (response.data) {
          await fetchExpenses()
          setExpenseAmount(0)
          setExpenseDescription('')
          setExpenseDate('')
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  const handleResetBudget = async () => {
    try {
      if (user.id) {
        const response = await resetExpenses(user.id) as unknown as any
        if (response.data) {
          await fetchBudget()
          setExpensesState([])
        }
      }
    } catch (error) {
      console.error('Error resetting budget:', error)
    }
  }

  const calculateRemainingBudget = () => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0)
    return budget !== null ? budget - totalExpenses : null
  }

  return (
    <div className="flex flex-col min-h-screen text-black">
      <header className="bg-[#FFF8DC] p-4">
        <h1 className="text-4xl font-bold text-center">Daily Finances</h1>
      </header>

      <div className="flex flex-1">
        <div className="w-64 bg-[#F4D03F] p-4 space-y-4">
          <button
            onClick={() => setActiveTab('about')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'about' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => setActiveTab('add-expenses')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'add-expenses' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            ADD EXPENSES
          </button>
          <button
            onClick={() => setActiveTab('list-expenses')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'list-expenses' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            LIST OF EXPENSES
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'budget' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            BUDGET
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className={`w-full p-4 rounded-lg text-center font-bold ${
              activeTab === 'reset' ? 'bg-[#FF6B6B] text-white' : 'bg-[#FFF8DC] hover:bg-[#FFE4B5]'
            }`}
          >
            RESET
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full p-4 rounded-lg text-center font-bold bg-[#FFF8DC] hover:bg-[#FFE4B5]"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 bg-[#ca9a5c] p-8">
          <div className="h-full p-8 rounded-lg ">
            {activeTab === 'about' && (
              <div className="bg-[#FFF8DC] rounded-2xl flex flex-col items-center justify-center h-full">
                <h2 className="mb-4 text-4xl font-bold">About</h2>
                <p className="text-2xl text-center">
                  This website will help you track your daily finances.
                </p>
              </div>
            )}

            {activeTab === 'add-expenses' && (
              <div className="bg-[#ca9a5c] flex flex-col items-center justify-center h-full">
                <h2 className="mb-8 text-4xl font-bold">Add Expenses</h2>
                <div className="w-full max-w-md space-y-4">
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="w-full p-4 border border-[#ca9a5c]-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleAddExpense}
                    className="mx-auto block px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
                  >
                    ADD
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'list-expenses' && (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-full p-4 bg-white rounded-2xl">
                  <div className="grid grid-cols-3 gap-4 mb-4 font-bold">
                    <div>Description</div>
                    <div>Amount</div>
                    <div>Date</div>
                  </div>
                  {expenses.map((expense, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                      <div>{expense.description}</div>
                      <div>${expense.value}</div>
                      <div>{new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 font-bold">
                  Total: ${expenses.reduce((sum, expense) => sum + expense.value, 0)}
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="flex flex-col items-center justify-center h-full bg-[#c99a5b] rounded-lg">
                <div className="flex items-center mb-8 space-x-4 text-lg text-gray-600">
                  <div className="p-10 bg-white rounded-lg shadow-md">Set Budget</div>
                  <div>-</div>
                  <div className="p-10 bg-white rounded-lg shadow-md">The amount of your expenses</div>
                  <div className=''>=</div>
                  <div className="p-10 bg-white rounded-lg shadow-md">The remaining balance of your budget</div>
                </div>
                <div className="w-full max-w-md space-y-2">
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Current Budget:</span> {budget !== null ? `$${budget}` : 'Not set'}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Total Expenses:</span> ${expenses.reduce((sum, expense) => sum + expense.value, 0)}
                  </p>
                  <p className="text-lg text-gray-700">
                    <span className="font-semibold">Remaining Budget:</span> {calculateRemainingBudget() !== null ? `$${calculateRemainingBudget()}` : 'N/A'}
                  </p>

                  {/* Input and Button Section */}
                  <div className="flex flex-col items-center mt-2">
                    <input
                      type="number"
                      value={newBudget}
                      onChange={(e) => setNewBudget(Number(e.target.value))}
                      placeholder="Set new budget"
                      className="w-full max-w-sm p-4 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                      onClick={handleSetBudget}
                      className="px-8 py-3 w-full max-w-sm rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-semibold text-gray-800 shadow-md transition ease-in-out duration-200"
                    >
                      Set Budget
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#F4D03F] p-8 rounded-lg text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <p className="mb-4 text-xl">Are you sure you want to reset your expenses?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleResetBudget}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                YES
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#F4D03F] p-8 rounded-lg text-center">
            <div className="mb-4 text-6xl">⚠️</div>
            <p className="mb-4 text-xl">Are you sure you want to Logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                YES
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-8 py-2 rounded-lg bg-[#FFF8DC] hover:bg-[#FFE4B5] font-bold"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

