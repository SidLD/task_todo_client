'use client'

import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { format } from 'date-fns'
import { io, Socket } from 'socket.io-client'
import { Checkbox } from "@/components/ui/checkbox"

interface Notification {
  id: string
  source: string
  message: string
  timestamp: Date
  read: boolean
}

// Dummy data for initial notifications
const dummyNotifications: Notification[] = [
  {
    id: '1',
    source: 'Calbayog District Hospital',
    message: 'Dear Certified Donor, the organization would like to thank you for participating in the recent blood donation drive...',
    timestamp: new Date('2024-01-20T09:05:00'),
    read: false
  },
  {
    id: '2',
    source: 'BloodLink',
    message: "Dear Donor, It's been 16 weeks since your last donation, and you're now eligible to donate again! It's Time to Save...",
    timestamp: new Date('2024-01-20T07:45:00'),
    read: false
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set())
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Simulate API fetch
    const fetchNotifications = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNotifications(dummyNotifications)
      setIsLoading(false)
    }

    fetchNotifications()

    // Setup WebSocket connection
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket']
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server')
    })

    newSocket.on('newNotification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
    })

    setSocket(newSocket)

    // Cleanup function
    return () => {
      if (newSocket) newSocket.disconnect()
    }
  }, [])

  // Simulate WebSocket server (for demonstration purposes)
  useEffect(() => {
    if (!socket) return

    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        source: Math.random() > 0.5 ? 'BloodLink' : 'Calbayog District Hospital',
        message: `New notification ${Date.now()}`,
        timestamp: new Date(),
        read: false
      }
      socket.emit('newNotification', newNotification)
    }, 10000) // Send a new notification every 10 seconds

    return () => clearInterval(interval)
  }, [socket])

  const sources = Array.from(new Set(notifications.map(n => n.source)))

  const filteredNotifications = notifications.filter(notification =>
    selectedSources.size === 0 || selectedSources.has(notification.source)
  )

  const toggleSource = (source: string) => {
    const newSources = new Set(selectedSources)
    if (newSources.has(source)) {
      newSources.delete(source)
    } else {
      newSources.add(source)
    }
    setSelectedSources(newSources)
  }

  return (
    <div className="min-h-full bg-[#4A1515]">
      <div className="max-w-3xl p-4 mx-auto">
        <div className="bg-[#3D0000] rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h1 className="text-xl font-semibold text-white">REMINDERS/INVOICE</h1>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="text-white hover:opacity-80"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="p-4 bg-white/5">
              <h2 className="mb-2 text-white">Filter by Source:</h2>
              <div className="space-y-2">
                {sources.map(source => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      id={source}
                      checked={selectedSources.has(source)}
                      onCheckedChange={() => toggleSource(source)}
                    />
                    <label
                      htmlFor={source}
                      className="text-sm text-white cursor-pointer"
                    >
                      {source}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="divide-y divide-white/10">
            {isLoading ? (
              <div className="p-8 text-center text-white">Loading...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-white">No notifications</div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-4 transition-colors hover:bg-white/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white">
                      {notification.source}
                    </h3>
                    <span className="text-sm text-white/60">
                      {format(notification.timestamp, 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-4">
          <a
            href="/donor"
            className="flex items-center text-white hover:opacity-80"
          >
          </a>
        </div>
      </div>
    </div>
  )
}

