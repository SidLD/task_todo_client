import React, { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import { ArrowLeft } from 'lucide-react'
import { Storage } from '@/lib/firebase'
export interface Event {
  id: string
  title: string
  description: string
  date: string
  imageUrl: string
  location: string
}


const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Join the Blood Donation Drive at Calbayog District Hospital',
    description: 'Join the Blood Donation Drive at Calbayog District Hospital This Jan 13',
    date: '2024-01-13',
    imageUrl: 'https://via.placeholder.com/400x300',
    location: 'Calbayog District Hospital'
  },
  {
    id: '2',
    title: 'Free Donor Screening at West Samar Doctors',
    description: 'Free Donor Screening at West Samar Doctors for the 1st week of February',
    date: '2024-02-01',
    imageUrl: 'https://via.placeholder.com/400x300',
    location: 'West Samar Doctors'
  },
  {
    id: '3',
    title: 'Join Red Cross Blood Donation Drive',
    description: 'Join Red Cross Blood Donation Drive at Calbayog District Hospital This February',
    date: '2024-02-15',
    imageUrl: 'https://via.placeholder.com/400x300',
    location: 'Calbayog District Hospital'
  }
]

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setEvents(dummyEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleImageUpload = async (file: File, eventId: string) => {
    try {
      const storageRef = ref(Storage, `events/${eventId}/${file.name}`)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      
      // Update event with new image URL
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventId
            ? { ...event, imageUrl: url }
            : event
        )
      )

      // In a real app, you would also update the backend here
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#4A1515] p-8">
        <div className="text-center text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#4A1515]">
      <div className="p-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <img
              src="https://via.placeholder.com/40"
              alt="BloodLink Logo"
              className="rounded-full"
            />
            <span className="text-2xl font-bold text-white">BLOOD<span className="text-red-400">Link</span></span>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-16 text-4xl font-bold text-center text-white">
          UPCOMING EVENTS
        </h1>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#3D0000] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="relative h-64">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
                {/* Image Upload Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file, event.id)
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-white/80">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => {/* Handle navigation */}}
            className="flex items-center text-white hover:opacity-80"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Admin</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventsPage

