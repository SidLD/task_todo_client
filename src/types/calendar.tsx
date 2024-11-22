export interface Appointment {
    id: string
    time: string
    patientName: string
    screeningType: string
    bloodUnits: number
  }
  
  export interface DayData {
    date: number
    appointments: Appointment[]
    bloodUnits?: number
  }
  
  export interface CalendarData {
    [key: string]: DayData
  }
  