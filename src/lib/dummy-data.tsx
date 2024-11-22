import { CalendarData } from "@/types/calendar";

export const dummyCalendarData: CalendarData = {
  '2024-01-04': {
    date: 4,
    bloodUnits: 3,
    appointments: [
      {
        id: '1',
        time: '09:00',
        patientName: 'John Doe',
        screeningType: 'Blood Donation',
        bloodUnits: 1
      },
      {
        id: '2',
        time: '10:00',
        patientName: 'Jane Smith',
        screeningType: 'Blood Screening',
        bloodUnits: 1
      },
      {
        id: '3',
        time: '11:00',
        patientName: 'Robert Johnson',
        screeningType: 'Blood Donation',
        bloodUnits: 1
      }
    ]
  },
  '2024-01-10': {
    date: 10,
    bloodUnits: 8,
    appointments: []
  },
  '2024-01-13': {
    date: 13,
    bloodUnits: 5,
    appointments: []
  }
}
