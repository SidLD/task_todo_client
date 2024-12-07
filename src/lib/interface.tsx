export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  password: string;
}
export interface IUser {
  _id: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  title?: string
}
export interface ISubject {
  _id: string
  name: string
}

export interface ITodo {
  _id: string
  name: string
  status: 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface ITask {
  _id: string
  user: string | IUser
  value: number
  startDate: Date
  endDate: Date
  title: string
  description: string
  todos: ITodo[]
}

export interface INotification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}


