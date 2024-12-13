import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api';
import { ArrowLeft, Brain, LogOut, Trash2, Check, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import background from "@/assets/background.jpg"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { auth } from '@/lib/services';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface Todo {
  name: string
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED',
  startDate: Date,
  endDate: Date
}
interface Task {
  _id: string;
  user: string;
  subject: {
    _id: string;
    name: string;
  };
  todo: [Todo];
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    title?: string;
  };
  createdAt: string;
  updatedAt: string;
}

async function getTodo(id: string) {
  const res = await getTodos(id) as unknown as any;
  return res.data;
}

function calculateRemainingDays(endDate: Date): number {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export default function TodoPage() {
  const router = useNavigate();
  const { id } = useParams();
  const [todo, setTodo] = useState<Todo[]>([]);
  const [_currentTask, setCurrentTask] = useState<Task>();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    name: '',
    startDate: new Date(),
    endDate: new Date()
  });
  const [dateError, setDateError] = useState<string>('');

  useEffect(() => {
    if (id) {
      getTodo(id as string).then((data) => {
        setCurrentTask(data)
        setTodo(data.todo);
      });
    }
  }, [id]);

  const handleCreateTask = async () => {
    if (!newTodo.name || !newTodo.startDate || !newTodo.endDate) return;
    
    const taskData = {
      ...newTodo,
      status: 'TO_DO',
      taskId: id
    };

    await createTodo(taskData);
    setNewTodo({ name: '', startDate: new Date(), endDate: new Date() });
    setIsAddTaskOpen(false);
    setDateError('');
    getTodo(id as string).then((data) => {
      setCurrentTask(data)
      setTodo(data.todo);
    });
  };

  const handleToggleTaskCompletion = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "TO_DO" ? "COMPLETED" : "TO_DO";
    await updateTodo(taskId, { status: newStatus });
    getTodo(id as string).then((data) => {
      setCurrentTask(data)
      setTodo(data.todo);
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTodo(taskId);
    getTodo(id as string).then((data) => {
      setCurrentTask(data)
      setTodo(data.todo);
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
            <Button variant="ghost" size="icon" className="text-gray-600" onClick={() => {
              router('/')
            }}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
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
              <h2 className="mb-4 text-2xl font-semibold text-black">Create a New Todo</h2>
              <input
                type="text"
                value={newTodo.name}
                onChange={(e) => setNewTodo({...newTodo, name: e.target.value})}
                placeholder="New Todo"
                className="w-full mb-4 text-black input"
              />
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={newTodo.startDate?.toISOString().split('T')[0]}
                  onChange={(e) => {
                    setNewTodo({...newTodo, startDate: new Date(e.target.value)});
                    setDateError('');
                  }}
                  className="w-full mt-1 text-black input"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={newTodo.endDate?.toISOString().split('T')[0]}
                  onChange={(e) => {
                    setNewTodo({...newTodo, endDate: new Date(e.target.value)});
                    setDateError('');
                  }}
                  className="w-full mt-1 text-black input"
                />
              </div>
              {dateError && <p className="mb-4 text-sm text-red-500">{dateError}</p>}
              <Button onClick={handleCreateTask} className="w-full bg-[#5CD7C9] text-white py-2 rounded-md">
                Add Todo
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
                          <div className="flex flex-col">
                            <span
                              className={`text-lg ${task.status === "COMPLETED" ? 'line-through text-gray-400' : 'text-black'}`}
                            >
                              {task.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                            </span>
                            <span className={`text-xs  ${calculateRemainingDays(task.endDate) < 3 ? 'text-red-500' : 'text-blue-500'}`}>
                              {calculateRemainingDays(task.endDate)} days remaining
                            </span>
                          </div>
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
            <Card className="border-[#5CD7C9] border-2 rounded-xl text-center w-full">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 ">
                  Hey <span className='uppercase'>{auth.getUserInfo().firstname}</span>,
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 ">
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

