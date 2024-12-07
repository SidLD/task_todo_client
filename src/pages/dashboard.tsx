'use client'

import { useState, useEffect } from 'react'
import { Brain, LogOut, MoreVertical, Plus, Trash2, Check, Square, CheckSquare } from 'lucide-react'
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { getUsers, getSubjects,  deleteSubject, createTask } from '@/lib/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { auth } from '@/lib/services'
import { useNavigate } from 'react-router-dom'

interface Subject {
  id: string;
  name: string;
  taskCount: number;
  professor: string;
}

interface User {
  id: string;
  name: string;
  totalTasks: number;
  progress: number;
}

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
  const [user, setUser] = useState<User>({ id: "", name: "", totalTasks: 0, progress: 0 })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [professors, setProfessors] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const user = auth.getRole()
    if(user == 'USER'){
        navigate('/user')
    }else if(user == "ADMIN"){
        navigate('/admin')
    }else{
      navigate('/')
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const subjectsRes = await getSubjects() as unknown as any
      setSubjects(subjectsRes.data || [])
      
      const uniqueSubjects = [...new Set(subjectsRes.data.map((s: Subject) => s.name))] as any
      setAvailableSubjects(uniqueSubjects)

      const usersRes = await getUsers('TEACHER') as unknown as any
      setProfessors(usersRes.data.map((user: any) => `${user.firstName} ${user.lastName}`) || [])

      setUser({
        id: "1",
        name: "Lek",
        totalTasks: subjectsRes.data.reduce((acc: number, subj: Subject) => acc + subj.taskCount, 0),
        progress: 50
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleAddSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSubject = {
      name: formData.get('subject') as string,
      taskCount: parseInt(formData.get('task') as string) || 0,
      professor: formData.get('professor') as string,
    }
    try {
      await createTask(newSubject)
      await fetchData()
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding subject:', error)
    }
  }

  const handleDeleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedSubjects.length} selected items?`)) {
      try {
        await Promise.all(selectedSubjects.map(id => deleteSubject(id)))
        await fetchData()
        setSelectedSubjects([])
        setIsSelectionMode(false)
      } catch (error) {
        console.error('Error deleting subjects:', error)
      }
    }
  }

  const toggleSubjectSelection = (id: string) => {
    setSelectedSubjects(prev => 
      prev.includes(id) 
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedSubjects.length === subjects.length) {
      setSelectedSubjects([])
    } else {
      setSelectedSubjects(subjects.map(s => s.id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
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
      
      <main className="container px-4 py-8 mx-auto">
        {selectedSubjects.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-5 h-5 text-[#5CD7C9]" />
              {selectedSubjects.length} Item{selectedSubjects.length !== 1 ? 's' : ''} Selected
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
                onClick={handleDeleteSelected}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative pb-20 space-y-4">
            {subjects.map((subject) => (
              <Card 
                key={subject.id}
                className="bg-[#5CD7C9] border-none rounded-xl overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
                      <p className="text-gray-700">{subject.taskCount} Task{subject.taskCount !== 1 ? 's' : ''}</p>
                      <p className="text-gray-700">{subject.professor}</p>
                    </div>
                    {isSelectionMode ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => toggleSubjectSelection(subject.id)}
                      >
                        {selectedSubjects.includes(subject.id) ? (
                          <CheckSquare className="w-5 h-5 text-gray-800" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-800" />
                        )}
                      </Button>
                    ) : null}
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
                  Hey {user.name},
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl text-gray-600">Today you have {user.totalTasks} tasks</p>
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
                      {user.progress}%
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#5CD7C9] border-none rounded-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Add New Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gray-800">Subject</Label>
              <Select name="subject" required>
                <SelectTrigger className="border-none bg-gray-100/80">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject, index) => (
                    <SelectItem key={index} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        
            <div className="space-y-2">
              <Label htmlFor="professor" className="text-gray-800">Professor</Label>
              <Select name="professor" required>
                <SelectTrigger className="border-none bg-gray-100/80">
                  <SelectValue placeholder="Select Professor" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((prof, index) => (
                    <SelectItem key={index} value={prof}>{prof}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-800 bg-gray-100/80 hover:bg-gray-200/80"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4AC7B9] text-gray-800 hover:bg-[#3AB7A9]"
              >
                Add
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

