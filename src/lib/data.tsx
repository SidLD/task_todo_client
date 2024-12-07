export type Task = {
  id: string
  subject: string
  title: string
  professor: string
  completed: boolean
}

export type Subject = {
  id: string
  name: string
  professor: string
  tasks: Task[]
}

export const subjects: Subject[] = [
  {
    id: "1",
    name: "Free Elective 2",
    professor: "Harris Tarrayo",
    tasks: [
      { id: "1", subject: "Free Elective 2", title: "Assignment 1", professor: "Harris Tarrayo", completed: true },
      { id: "2", subject: "Free Elective 2", title: "Assignment 2", professor: "Harris Tarrayo", completed: false },
    ]
  },
  {
    id: "2",
    name: "IS Elective 4",
    professor: "Alvin Lentejas",
    tasks: [
      { id: "3", subject: "IS Elective 4", title: "Project", professor: "Alvin Lentejas", completed: false },
    ]
  },
  {
    id: "3",
    name: "IS Elective 5",
    professor: "Nancy Getalado",
    tasks: [
      { id: "4", subject: "IS Elective 5", title: "Research Paper", professor: "Nancy Getalado", completed: true },
    ]
  }
]

export const professors = [
  "Harris Tarrayo",
  "Alvin Lentejas",
  "Nancy Getalado"
]

