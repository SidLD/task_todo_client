'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Search } from 'lucide-react'

interface Donor {
  id: string
  name: string
  bloodType: string
  lastDonated?: string
  firstDonated?: string
}

interface DonorData {
  certified: Donor[]
  new: Donor[]
}

const dummyDonorData: DonorData = {
  certified: [
    { id: '8501539', name: 'Juan Dela Cruz', bloodType: 'AB+', lastDonated: '07/15/2024' },
    { id: '7859887', name: 'Pedro Penduko', bloodType: 'B+', lastDonated: '09/25/2024' },
    { id: '9875666', name: 'Hannah Montana', bloodType: 'AB-', lastDonated: '05/29/2024' }
  ],
  new: [
    { id: '7988561', name: 'Juan Dela Cruz', bloodType: 'AB-', firstDonated: '09/05/2024' },
    { id: '1165794', name: 'Juan Dela Cruz', bloodType: 'O+', firstDonated: '08/05/2024' },
    { id: '1566787', name: 'Juan Dela Cruz', bloodType: 'B+', firstDonated: '09/18/2024' }
  ]
}

type DonorView = 'certified' | 'new'

export default function DonorsPage() {
  const [view, setView] = useState<DonorView>('certified')
  const [searchQuery, setSearchQuery] = useState('')
  const [donorData, setDonorData] = useState<DonorData>({ certified: [], new: [] })
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate API fetch
  useEffect(() => {
    const fetchDonors = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDonorData(dummyDonorData)
      setFilteredDonors(dummyDonorData[view])
      setIsLoading(false)
    }

    fetchDonors()
  }, [view])

  // Handle search
  useEffect(() => {
    const donors = donorData[view]
    if (searchQuery.trim() === '') {
      setFilteredDonors(donors)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = donors.filter(donor => 
      donor.id.toLowerCase().includes(query) ||
      donor.name.toLowerCase().includes(query) ||
      donor.bloodType.toLowerCase().includes(query)
    )
    setFilteredDonors(filtered)
  }, [searchQuery, donorData, view])

  return (
    <div className="min-h-full bg-[#4A1515]">
      <div className="max-w-6xl px-4 py-6 mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a 
            href="/admin"
            className="flex items-center text-white hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-xl">Certified Donors</span>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setView('certified')}
            className={`px-6 py-2 text-xl rounded-t-lg ${
              view === 'certified'
                ? 'bg-[#D88E8E] text-[#4A1515] font-semibold'
                : 'bg-[#4A1515] text-white'
            }`}
          >
            Certified Donors
          </button>
          <button
            onClick={() => setView('new')}
            className={`px-6 py-2 text-xl rounded-t-lg ${
              view === 'new'
                ? 'bg-[#4A1515] text-white font-semibold'
                : 'bg-[#D88E8E] text-[#4A1515]'
            }`}
          >
            New Donors
          </button>
        </div>

        {/* Content Area */}
        <div className={`rounded-lg ${view === 'certified' ? 'bg-[#D88E8E]' : 'bg-[#4A1515]'}`}>
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Enter Donor ID, name, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md px-4 py-2 text-gray-800 placeholder-gray-500 rounded-full bg-white/80 backdrop-blur-sm"
              />
              <Search className="absolute w-5 h-5 text-gray-500 -translate-y-1/2 right-4 top-1/2" />
            </div>

            {/* Donors Table */}
            <div className="p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-white">
                    <th className="px-4 py-2">Donor ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Blood Type</th>
                    <th className="px-4 py-2">
                      {view === 'certified' ? 'Last Donated' : 'First Donated'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-white">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredDonors.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-white">
                        No donors found
                      </td>
                    </tr>
                  ) : (
                    filteredDonors.map((donor) => (
                      <tr key={donor.id} className="text-white/90 hover:bg-white/5">
                        <td className="px-4 py-2">{donor.id}</td>
                        <td className="px-4 py-2">{donor.name}</td>
                        <td className="px-4 py-2">{donor.bloodType}</td>
                        <td className="px-4 py-2">
                          {view === 'certified' ? donor.lastDonated : donor.firstDonated}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

