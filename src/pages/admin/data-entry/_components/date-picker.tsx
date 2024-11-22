import React from 'react'

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  return (
    <input
      type="date"
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
      className="w-full px-3 py-2 border rounded-md"
    />
  )
}

