
import { Calendar, ClipboardList, Droplet } from 'lucide-react'

import logo from "../../../assets/logo.png"
export default function AdminDashboard() {
  console.log('asdsd')
  return (
    <div className="bg-[#3D0000] p-8 lg:p-12 flex flex-col min-h-[600px]">
      <div className="flex items-center text-white/90">
        <img width={80} src={logo} alt="logo" className="relative brightness-200 top-[-20px] left-[-20px]" />
      </div>
     <header className="flex items-center p-4">
        <h1 className="pr-8 mx-auto text-2xl font-bold text-white">
          ADMIN DASHBOARD
        </h1>
      </header>
      
      <main className="container px-4 py-12 mx-auto">
        <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-3">
          <a
            href="/admin/calendar"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <Calendar className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold">Calendar</span>
          </a>
          
          <a
            href="/admin/donor-list"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <ClipboardList className="w-24 h-24 mb-4 stroke-[1.5]" />
            <span className="text-xl font-semibold">Donor List</span>
          </a>
          
          <a
            href="/admin/blood-supply"
            className="flex flex-col items-center p-6 text-white transition-colors rounded-lg hover:bg-white/5 group"
          >
            <div className="relative w-24 h-24 mb-4">
              <Droplet className="w-full h-full stroke-[1.5]" />
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L12 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold">Blood Supply Levels</span>
          </a>
        </div>
      </main>
    </div>
    )
}

