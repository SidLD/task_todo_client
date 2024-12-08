import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api';
import { ArrowLeft, Brain, LogOut, MoreVertical, Trash2, Check, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import background from "@/assets/background.jpg"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { auth } from '@/lib/services';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

async function getTodo(id: string) {
  const res = await getTodos(id) as unknown as any;
  return res.data;
}

export default function TodoPage() {
  const router = useNavigate();
  const { id } = useParams();
  const [todo, setTodo] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getTodo(id as string).then((data) => {
        setTodo(data);
      });
    }
  }, [id]);

  const progress = Math.round((todo.filter(task => task.status === "COMPLETED").length / todo.length) * 100);

  const toggleTaskSelection = (id: string) => {
    setSelectedTasks(prev => 
      prev.includes(id) 
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === todo.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(todo.map((t: any) => t._id));
    }
  };

  const handleDeleteSelected = async () => {
    console.log('Deleting selected tasks:', selectedTasks);
    await Promise.all(selectedTasks.map(async (taskId) => {
      await deleteTodo(taskId);
    }));
    setSelectedTasks([]);
    setIsSelectionMode(false);
    getTodo(id as string).then((data) => {
      setTodo(data);
    });
  };

  const handleCreateTask = async () => {
    if (newTaskName.trim() === '') return;
    
    const taskData = {
      name: newTaskName,
      status: 'TO_DO', // Default status for new tasks
      taskId: id // Assuming the todo list is tied to a specific task (e.g., a project or subject)
    };

    await createTodo(taskData);
    setNewTaskName(''); // Clear input field after creation
    getTodo(id as string).then((data) => {
      setTodo(data);
    });
  };

  const handleToggleTaskCompletion = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "TO_DO" ? "COMPLETED" : "TO_DO";
    await updateTodo(taskId, { status: newStatus });
    getTodo(id as string).then((data) => {
      setTodo(data);
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTodo(taskId);
    getTodo(id as string).then((data) => {
      setTodo(data);
    });
  };

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
            <h1 className="text-2xl font-bold text-black">Smart Tracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => router('/')}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
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
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => {
              auth.clear()
              setTimeout(() => {
                router('/')
              }, 1000)
            }}>
              <LogOut className="w-6 h-6" />
            </Button>
          </div>
        </header>
  
        <main className="container relative z-10 px-4 py-8 mx-auto">
          {/* Modal for Adding Task */}
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#5CD7C9] text-white p-4 rounded-full shadow-lg"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 bg-white rounded-lg shadow-lg w-96">
              <h2 className="mb-4 text-2xl font-semibold text-black">Create a New Task</h2>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="New Task"
                className="w-full mb-4 input"
              />
              <Button onClick={handleCreateTask} className="w-full bg-[#5CD7C9] text-white py-2 rounded-md">
                Add Task
              </Button>
            </DialogContent>
          </Dialog>
  
          {/* Todo List */}
          {todo.length > 0 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <Card className="bg-[#5CD7C9] border-none  overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-black">{todo.length} Tasks</h2>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  
                {todo.map((task: any) => (
                  <Card key={task._id} className="overflow-hidden transition-colors bg-transparent border-none shadow-none ">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6"
                                onClick={() => handleToggleTaskCompletion(task._id, task.status)}
                              >
                                <div
                                  className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center
                                    ${task.status === "COMPLETED" ? 'border-[#5CD7C9] bg-[#5CD7C9]' : 'border-[#5CD7C9]'}`}
                                >
                                  {task.status === "COMPLETED" && (
                                    <Check className="w-4 h-4 text-white" />
                                  )}
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as {task.status === "COMPLETED" ? 'incomplete' : 'complete'}</p>
                            </TooltipContent>
                          </Tooltip>
                          <span
                            className={`text-lg ${task.status === "COMPLETED" ? 'line-through text-gray-400' : 'text-black'}`}
                          >
                            {task.name}
                          </span>
                        </div>
  
                        <div className="flex items-center gap-2">
                          {task.status === "COMPLETED" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600"
                              onClick={() => handleDeleteTask(task._id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="lg:pl-8">
            <Card className="border-[#5CD7C9] border-2 rounded-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Hey {auth.getUserInfo().firstName},
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl text-gray-600">Today you have {todo.length} tasks</p>
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
                      strokeDasharray={`${(todo.filter(t => t.status == 'COMPLETED').length * 100 / todo.length) * 2.83}, 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-4xl font-bold fill-[#5CD7C9]">
                      {(todo.filter(t => t.status == 'COMPLETED').length * 100 / todo.length).toFixed(0)}%
                    </text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
            </div>
          )}
        </main>
      </div>
    </TooltipProvider>
  );
  
}
