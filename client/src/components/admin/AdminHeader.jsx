import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck, LogOut } from 'lucide-react'

export default function AdminHeader({ handleLogout }) {
  const location = useLocation()

  return (
    <header className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg text-white leading-none">Admin Dashboard</h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/60 mt-0.5">
              Twin Care Hospital
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center bg-black/15 rounded-lg p-1 border border-white/5">
          <Link 
            to="/admin/dashboard" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-white shadow-sm text-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
          >
            Messages
          </Link>
          <Link 
            to="/admin/appointments" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/appointments' ? 'bg-white shadow-sm text-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
          >
            Appointments
          </Link>
          <Link 
            to="/admin/doctors" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/doctors' ? 'bg-white shadow-sm text-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
          >
            Doctors
          </Link>
          <Link 
            to="/admin/news" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/news' ? 'bg-white shadow-sm text-primary' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
          >
            News
          </Link>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 font-body text-sm text-white/70 hover:text-white transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  )
}
