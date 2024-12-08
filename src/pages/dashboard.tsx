'use client'

import { useState, useEffect } from 'react'
import { Brain, LogOut, MoreVertical, Plus, Trash2, Check, Square, CheckSquare, Pencil, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import background from "@/assets/background.jpg"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { getUsers, getSubjects, deleteTask, createTask, getTasks, updateTask } from '@/lib/api'
import { auth } from '@/lib/services'
import { useNavigate } from 'react-router-dom'
import { ISubject, IUser } from '@/lib/interface'
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { TooltipTrigger } from '@radix-ui/react-tooltip'

interface Task {
  _id: string;
  user: string;
  subject: {
    _id: string;
    name: string;
  };
  todo: [
    {
      name: string
    }
  ];
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
  };
  startDate?: string;
  endDate?: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [availableSubjects, setAvailableSubjects] = useState<ISubject[]>([])
  const [professors, setProfessors] = useState<IUser[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskModalMode, setTaskModalMode] = useState<'add' | 'edit' | 'delete'>('add')
  const navigate = useNavigate()

  useEffect(() => {
    const userSession = auth.getRole()
    if(userSession == 'USER'){
      navigate('/user')
    }else if(userSession == "ADMIN"){
      navigate('/admin')
    }else{
      navigate('/')
    }
    fetchData()
  }, [])

  const calculateProgress = () => {
    let todos:any = [];
    tasks.forEach(t => {
      t.todo.forEach(d => {
        todos.push(d)
      })
    })
    const completedTodos = todos.filter((t:any) => t.status === "COMPLETED").length;
    const progressPercentage = (completedTodos / todos.length) * 100;
    return progressPercentage; // Returns as a string with 2 decimal places
  };

  const fetchData = async () => {
    try {
      const subjectsRes = await getSubjects() as unknown as any
      const uniqueSubjects = [...new Set(subjectsRes.data)] as any
      setAvailableSubjects(uniqueSubjects)

      const usersRes = await getUsers('TEACHER') as unknown as any
      setProfessors(usersRes.data || [])

      const tasksRes = await getTasks() as unknown as any
      setTasks(tasksRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleTaskAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const taskData = {
      user: auth.getUserInfo().id,
      subject: formData.get('subject') as string,
      teacher: formData.get('teacher') as string,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    }

    try {
      if (taskModalMode === 'add') {
        await createTask(taskData)
      } else if (taskModalMode === 'edit' && currentTask) {
        await updateTask(currentTask._id, { ...taskData, _id: currentTask._id })
      } else if (taskModalMode === 'delete' && currentTask) {
        await deleteTask(currentTask._id)
      }
      await fetchData()
      closeTaskModal()
    } catch (error) {
      console.error(`Error ${taskModalMode}ing task:`, error)
    }
  }

  const openTaskModal = (mode: 'add' | 'edit' | 'delete', task?: Task) => {
    setTaskModalMode(mode)
    setCurrentTask(task || null)
    if (task) {
      setStartDate(task.startDate ? new Date(task.startDate) : undefined)
      setEndDate(task.endDate ? new Date(task.endDate) : undefined)
    } else {
      setStartDate(undefined)
      setEndDate(undefined)
    }
    setIsTaskModalOpen(true)
  }

  const closeTaskModal = () => {
    setIsTaskModalOpen(false)
    setCurrentTask(null)
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev => 
      prev.includes(id) 
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasks.map(t => t._id))
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTasks.map(id => deleteTask(id)))
      await fetchData()
      setSelectedTasks([])
      setIsSelectionMode(false)
    } catch (error) {
      console.error('Error deleting tasks:', error)
    }
  }

  const TaskForm = () => (
    <form onSubmit={handleTaskAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-gray-800">Subject</Label>
        <Select name="subject" required defaultValue={currentTask?.subject._id}>
          <SelectTrigger className="text-black border-none bg-gray-100/80">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent className='text-black'>
            {availableSubjects.map((subject, index) => (
              <SelectItem key={index} value={subject._id}>{subject.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="teacher" className="text-gray-800">Teacher</Label>
        <Select name="teacher" required defaultValue={currentTask?.teacher._id}>
          <SelectTrigger className="text-black border-none bg-gray-100/80">
            <SelectValue placeholder="Select Teacher" />
          </SelectTrigger>
          <SelectContent>
            {professors.map((prof, index) => (
              <SelectItem key={index} value={prof._id}>
                {`${prof?.title || ''} ${prof.firstName}, ${prof.lastName}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-black">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal border-none bg-gray-100/80 ${!startDate && "text-muted-foreground"}`}
            >
              {startDate ? format(startDate, "PPP") : "Pick a start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 text-black" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate" className="text-gray-800">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal border-none bg-gray-100/80 ${!endDate && "text-muted-foreground"}`}
            >
              {endDate ? format(endDate, "PPP") : "Pick an end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              disabled={(date) => startDate ? date < startDate : false}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="secondary"
          onClick={closeTaskModal}
          className="text-gray-800 bg-gray-100/80 hover:bg-gray-200/80"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#4AC7B9] text-gray-800 hover:bg-[#3AB7A9]"
        >
          {taskModalMode === 'add' ? 'Add' : taskModalMode === 'edit' ? 'Update' : 'Delete'}
        </Button>
      </div>
    </form>
  )

  return (
    <TooltipProvider>
      
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
     <div 
          className="fixed inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `url(${background})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '50%'
          }}
        />

      <header className="relative z-10 flex items-center justify-between p-4 shadow-sm bg-white/80 backdrop-blur-sm">
        <div className="flex items-center">
          <Brain className="w-10 h-10 text-[#5CD7C9] mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Smart Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <MoreVertical className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#5CD7C9] border-none">
              <DropdownMenuItem 
                className="text-gray-800 focus:bg-[#4AC7B9] focus:text-gray-800"
                onClick={() => setIsSelectionMode(true)}
              >
                Select items
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-800 focus:bg-[#4AC7B9] focus:text-gray-800">
                Sort
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-800 focus:bg-[#4AC7B9] focus:text-gray-800">
                Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => {
            auth.clear()
            setTimeout(() => {
              navigate('/')
            }, 1000)
          }}>
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </header>
      
      <main className="container relative z-10 px-4 py-8 mx-auto">
        {selectedTasks.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-[#5CD7C9]" />
              {selectedTasks.length} Item{selectedTasks.length !== 1 ? 's' : ''} Selected
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="text-gray-600"
                onClick={handleSelectAll}
              >
                Select all
              </Button>
              <Button
                variant="ghost"
                className="text-red-600"
                onClick={() => openTaskModal('delete')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600"
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedTasks([])
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative pb-20 space-y-4">
            {tasks.map((task) => (
              <Card 
                key={task._id}
                className="bg-[#5CD7C9] border-none rounded-xl overflow-hidden hover:bg-[#4AC7B9] transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{task.subject.name}</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <a href={`tasks/${task._id}`}>
                            {task.todo.length} Task
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs text-gray-500">Check out tasks</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-700">{`${task.teacher.firstName} ${task.teacher.lastName}`}</p>
                      {isSelectionMode ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskSelection(task._id);
                          }}
                        >
                          {selectedTasks.includes(task._id) ? (
                            <CheckSquare className="w-5 h-5 text-gray-800" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-800" />
                          )}
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-800" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => openTaskModal('edit', task)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onSelect={() => openTaskModal('delete', task)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              className="fixed bottom-8 right-8 lg:left-1/2 lg:-translate-x-1/2 w-14 h-14 rounded-full bg-[#5CD7C9] hover:bg-[#4AC7B9] shadow-lg"
              onClick={() => openTaskModal('add')}
            >
              <Plus className="w-8 h-8" />
            </Button>
          </div>
          <div className="lg:pl-8">
            <Card className="border-[#5CD7C9] border-2 rounded-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Hey {auth.getUserInfo().firstName},
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl text-gray-600">Today you have {tasks.length} Subject</p>
                <p className="text-2xl font-bold text-[#5CD7C9]">GOODLUCK!</p>
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#5CD7C9"
                      strokeWidth="10"
                      strokeDasharray={`${calculateProgress() * 2.83}, 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-4xl font-bold fill-[#5CD7C9]">
                      {calculateProgress().toFixed(0)}%
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">
              {taskModalMode === 'add' ? 'Add New Task' : 
               taskModalMode === 'edit' ? 'Edit Task' : 'Delete Task'}
            </h2>
            {taskModalMode === 'delete' ? (
              <div>
                <p className="mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeTaskModal}
                    className="text-gray-800 bg-gray-100/80 hover:bg-gray-200/80"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleTaskAction(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <TaskForm />
            )}
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  )
}

