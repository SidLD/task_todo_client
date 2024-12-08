'use client'

import { useState, useEffect } from 'react'
import { Brain, LogOut, MoreVertical, Plus, Trash2, Check, Square, CheckSquare, Pencil, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
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

interface Task {
  _id: string;
  user: string;
  subject: {
    _id: string;
    name: string;
  };
  todo: string[],
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [professors, setProfessors] = useState<IUser[]>([])
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isSingleDeleteDialogOpen, setIsSingleDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
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

  useEffect(() => {
    return () => {
      // Clean up any lingering modal effects when component unmounts
      document.body.style.pointerEvents = ''
    }
  }, [])

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

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newTask = {
      user: auth.getUserInfo().id,
      subject: formData.get('subject') as string,
      teacher: formData.get('teacher') as string,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    }
    try {
      await createTask(newTask)
      await fetchData()
      setIsAddModalOpen(false)
      setStartDate(undefined)
      setEndDate(undefined)
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTask) return

    const formData = new FormData(e.currentTarget)
    const updatedTask = {
      _id: editingTask._id,
      user: auth.getUserInfo().id,
      subject: formData.get('subject') as string,
      teacher: formData.get('teacher') as string,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    }
    try {
      await updateTask( editingTask._id, updatedTask)
      await fetchData()
      setIsEditModalOpen(false)
      setEditingTask(null)
      setStartDate(undefined)
      setEndDate(undefined)
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTasks.map(id => deleteTask(id)))
      await fetchData()
      setSelectedTasks([])
      setIsSelectionMode(false)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting tasks:', error)
    }
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setStartDate(task.startDate ? new Date(task.startDate) : undefined)
    setEndDate(task.endDate ? new Date(task.endDate) : undefined)
    setIsEditModalOpen(true)
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

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        await fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSingleDelete = async () => {
    if (!taskToDelete) return
    try {
      await deleteTask(taskToDelete)
      await fetchData()
      setIsSingleDeleteDialogOpen(false)
      setTaskToDelete(null)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const TaskForm = ({ onSubmit, initialData, submitText }: { 
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    initialData?: Task,
    submitText: string 
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-gray-800">Subject</Label>
        <Select name="subject" required defaultValue={initialData?.subject._id}>
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
        <Select name="teacher" required defaultValue={initialData?.teacher._id}>
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
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
          }}
          className="text-gray-800 bg-gray-100/80 hover:bg-gray-200/80"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#4AC7B9] text-gray-800 hover:bg-[#3AB7A9]"
        >
          {submitText}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-10"
        style={{
          backgroundImage: 'url("/smart-tracker-logo.png")',
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
                onClick={() => setIsDeleteDialogOpen(true)}
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
                      <p className="text-sm text-gray-700">{task.todo.length} Task</p>
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
                            <DropdownMenuItem onSelect={() => openEditModal(task)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onSelect={() => {
                                setTaskToDelete(task._id)
                                setIsSingleDeleteDialogOpen(true)
                              }}
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
              onClick={() => setIsAddModalOpen(true)}
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
                <p className="text-xl text-gray-600">Today you have {tasks.length} tasks</p>
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
                      strokeDasharray={`${80 * 2.83}, 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-4xl font-bold fill-[#5CD7C9]">
                      {80}%
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog 
        open={isAddModalOpen} 
        onOpenChange={(open) => {
          setIsAddModalOpen(open)
          if (!open) {
            setStartDate(undefined)
            setEndDate(undefined)
          }
        }}
      >
        <DialogContent className="bg-[#5CD7C9] border-none rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} submitText="Add" />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) {
            setEditingTask(null)
            setStartDate(undefined)
            setEndDate(undefined)
            // Ensure the modal is fully closed and cleaned up
            setTimeout(() => {
              document.body.style.pointerEvents = ''
            }, 100)
          }
        }}
      >
        <DialogContent 
          className="bg-[#5CD7C9] border-none rounded-xl max-w-md"
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleEditTask} initialData={editingTask!} submitText="Update" />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTasks.length} selected task{selectedTasks.length !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSelected}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isSingleDeleteDialogOpen} 
        onOpenChange={setIsSingleDeleteDialogOpen}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsSingleDeleteDialogOpen(false)
                setTaskToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleSingleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

