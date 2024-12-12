'use client'

import { useState, useEffect } from 'react'
import { Brain, LogOut, Plus, Check, Square, CheckSquare, Pencil, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import { getUsers, register, updateUser, deleteUser, getSubjects, createSubject, updateSubject, deleteSubject } from '@/lib/api'
import { RegisterFormData } from '@/lib/interface'
import { auth } from '@/lib/services'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"

interface Subject {
  _id?: string;
  name: string;
}

interface User {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  title?: string;
  password?: string;
  role: 'ADMIN' | 'USER' | 'TEACHER';
}

export default function ManagementDashboard() {
  const [professors, setProfessors] = useState<User[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<User | Subject | null>(null)
  const [activeTab, setActiveTab] = useState('professors')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const { toast } = useToast()
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
    fetchProfessors()
    fetchSubjects()
  }, [])

  const fetchProfessors = async () => {
    try {
      const res = await getUsers('TEACHER') as unknown as any
      if (res.data) {
        setProfessors(res.data)
      }
    } catch (error) {
      console.error('Error fetching professors:', error)
      setProfessors([])
    }
  }

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects() as unknown as any
      if (res.data) {
        setSubjects(res.data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setSubjects([])
    }
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      data[key] = value
    })

    const isProfessor = activeTab === 'professors'

    try {
      if (isProfessor) {
        await register(data as RegisterFormData)
        await fetchProfessors()
      } else {
        await createSubject(data as Subject)
        await fetchSubjects()
      }

      toast({
        title: `${isProfessor ? 'Professor' : 'Subject'} added successfully`,
        variant: 'default',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      data[key] = value
    })

    const isProfessor = activeTab === 'professors'

    try {
      if (isProfessor && editingItem) {
        await updateUser((editingItem as User)._id!, data as RegisterFormData)
        await fetchProfessors()
      } else if (!isProfessor && editingItem) {
        await updateSubject((editingItem as Subject)._id!, data as Subject)
        await fetchSubjects()
      }

      toast({
        title: `${isProfessor ? 'Professor' : 'Subject'} updated successfully`,
        variant: 'default',
      })
      setIsEditing(null)
      setEditingItem(null)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${activeTab === 'professors' ? 'professor' : 'subject'}?`)) {
      try {
        if (activeTab === 'professors') {
          await deleteUser(id)
          setProfessors(professors.filter(prof => prof._id !== id))
        } else {
          await deleteSubject(id)
          setSubjects(subjects.filter(subj => subj._id !== id))
        }

        toast({
          title: `${activeTab === 'professors' ? 'Professor' : 'Subject'} deleted successfully`,
          variant: 'default',
        })
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        })
      }
    }
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    const items = activeTab === 'professors' ? professors : subjects
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map(item => item._id!))
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="flex items-center justify-between p-4 bg-[#5CD7C9]">
        <div className="flex items-center">
          <Brain className="w-10 h-10 mr-2 text-black" />
          <h1 className="text-2xl font-bold text-black">Smart Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          
          <Button variant="ghost" size="icon" className="text-black" onClick={() => {
            auth.clear()
            setTimeout(() => {
              navigate('/')
            }, 1000)
          }}>
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </header>
      <main className="container px-4 py-10 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-blue-800">Management Dashboard</h2>
        <Tabs defaultValue="professors" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="professors" className="text-black bg-[#5CD7C9] data-[state=active]:bg-[#4AC7B9]">Professors</TabsTrigger>
            <TabsTrigger value="subjects" className="text-black bg-[#5CD7C9] data-[state=active]:bg-[#4AC7B9]">Subjects</TabsTrigger>
          </TabsList>
          <TabsContent value="professors">
            <ProfessorManagement
              professors={professors}
              isEditing={isEditing}
              editingItem={editingItem as User}
              setIsEditing={setIsEditing}
              setEditingItem={setEditingItem}
              handleCreate={handleCreate}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              isSelectionMode={isSelectionMode}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
            />
          </TabsContent>
          <TabsContent value="subjects">
            <SubjectManagement
              subjects={subjects}
              isEditing={isEditing}
              editingItem={editingItem as Subject}
              setIsEditing={setIsEditing}
              setEditingItem={setEditingItem}
              handleCreate={handleCreate}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              isSelectionMode={isSelectionMode}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
            />
          </TabsContent>
        </Tabs>
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-black">
              <Check className="w-5 h-5 text-[#5CD7C9]" />
              {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''} Selected
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="text-black"
                onClick={handleSelectAll}
              >
                Select all
              </Button>
              {/* <Button
                variant="ghost"
                className="text-red-600"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button> */}
              <Button
                variant="ghost"
                className="text-black"
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedItems([])
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

function ProfessorManagement({ 
  professors, 
  isEditing, 
  editingItem,
  setIsEditing, 
  setEditingItem,
  handleCreate, 
  handleUpdate, 
  isSelectionMode,
  selectedItems,
  toggleItemSelection
}: {
  professors: User[],
  isEditing: string | null,
  editingItem: User | null,
  setIsEditing: (id: string | null) => void,
  setEditingItem: (item: User | null) => void,
  handleCreate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  handleDelete: (id: string) => Promise<void>,
  isSelectionMode: boolean,
  selectedItems: string[],
  toggleItemSelection: (id: string) => void
}) {
  return (
    <div className="space-y-4 text-black">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 text-black bg-[#5CD7C9] hover:bg-[#4AC7B9]">
            <Plus className="w-4 h-4 mr-2" /> Add Professor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Add Professor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-800">First Name</Label>
                <Input id="firstName" name="firstName" required className="text-black border-blue-300 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-800">Last Name</Label>
                <Input id="lastName" name="lastName" required className="text-black border-blue-300 focus:border-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-blue-800">Middle Name</Label>
              <Input id="middleName" name="middleName" required className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800">Email</Label>
              <Input id="email" name="email" type="email" required className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-800">Title</Label>
              <Input id="title" name="title" className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <div className="hidden space-y-2">
              <Label htmlFor="password" className="text-blue-800">Password</Label>
              <Input id="password" value="password" name="password" type="hidden" required className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <Input id="role" name="role" type="hidden" value="TEACHER"  />
            <Button type="submit" className="w-full text-black bg-[#5CD7C9] hover:bg-[#4AC7B9]">
              Add Professor
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Edit Professor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-blue-800">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={editingItem?.firstName} required className="text-black border-blue-300 focus:border-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-blue-800">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={editingItem?.lastName} required className="text-black border-blue-300 focus:border-blue-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-blue-800">Middle Name</Label>
              <Input id="middleName" name="middleName" defaultValue={editingItem?.middleName} className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-800">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={editingItem?.email} required className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="text-blue-800">Title</Label>
              <Input id="title" name="title" defaultValue={editingItem?.title} className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <Input id="role" name="role" type="hidden" value="TEACHER"  />
            <Button type="submit" className="w-full text-black bg-[#5CD7C9] hover:bg-[#4AC7B9]">
              Update Professor
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {professors.map((professor) => (
          <Card
            key={professor._id}
            className="bg-[#5CD7C9] border-none rounded-xl overflow-hidden hover:bg-[#4AC7B9] transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-black">
                    {professor.title} {professor.firstName} {professor.lastName}
                  </h3>
                  <p className="text-sm text-black">{professor.email}</p>
                </div>
                <div className="flex gap-2">
                  {isSelectionMode ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => toggleItemSelection(professor._id!)}
                    >
                      {selectedItems.includes(professor._id!) ? (
                        <CheckSquare className="w-5 h-5 text-black" />
                      ) : (
                        <Square className="w-5 h-5 text-black" />
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsEditing(professor._id || null)
                          setEditingItem(professor)
                        }}
                        className="text-black hover:text-blue-800 hover:bg-[#4AC7B9]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => professor._id && handleDelete(professor._id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button> */}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SubjectManagement({ 
  subjects, 
  isEditing, 
  editingItem,
  setIsEditing, 
  setEditingItem,
  handleCreate, 
  handleUpdate, 
  isSelectionMode,
  selectedItems,
  toggleItemSelection
}: {
  subjects: Subject[],
  isEditing: string | null,
  editingItem: Subject | null,
  setIsEditing: (id: string | null) => void,
  setEditingItem: (item: Subject | null) => void,
  handleCreate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
  handleDelete: (id: string) => Promise<void>,
  isSelectionMode: boolean,
  selectedItems: string[],
  toggleItemSelection: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 text-black bg-[#5CD7C9] hover:bg-[#4AC7B9]">
            <Plus className="w-4 h-4 mr-2" /> Add Subject
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Add Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-800">Subject Name</Label>
              <Input id="name" name="name" required className="text-black border-blue-300 focus:border-blue-500" />
            </div>
            <Button type="submit" className="w-full text-black bg-[#5CD7C9] hover:bg-[#4AC7B9]">
              Add Subject
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing !== null} onOpenChange={(open) => !open && setIsEditing(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-blue-800">Edit Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-800">Subject Name</Label>
              <Input id="name" name="name" defaultValue={editingItem?.name} required className="border-blue-300 focus:border-blue-500" />
            </div>
            <Button type="submit" className="w-full text-black bg-[#5CD7C9] hover:bg-[#4AC7B9]">
              Update Subject
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {subjects.map((subject) => (
          <Card
            key={subject._id}
            className="bg-[#5CD7C9] border-none rounded-xl overflow-hidden hover:bg-[#4AC7B9] transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-black">{subject.name}</h3>
                <div className="flex gap-2">
                  {isSelectionMode ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => toggleItemSelection(subject._id!)}
                    >
                      {selectedItems.includes(subject._id!) ? (
                        <CheckSquare className="w-5 h-5 text-black" />
                      ) : (
                        <Square className="w-5 h-5 text-black" />
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsEditing(subject._id || null)
                          setEditingItem(subject)
                        }}
                        className="text-black hover:text-blue-800 hover:bg-[#4AC7B9]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => subject._id && handleDelete(subject._id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button> */}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

