declare module 'react-awesome-calendar' {
    import { FC } from 'react';
  
    export interface CalendarEvent {
      id: number;
      color: string; // Hex color code
      from: string;  // ISO 8601 date string
      to: string;    // ISO 8601 date string
      title: string;
    }
  
    export interface CalendarProps {
      events: CalendarEvent[];
      // Add other props as needed
    }
  
    const Calendar: FC<CalendarProps>;
    export default Calendar;
  }