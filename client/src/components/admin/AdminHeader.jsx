import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldCheck, LogOut } from 'lucide-react'

export default function AdminHeader({ handleLogout }) {
  const location = useLocation()

  return (
    <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <ShieldCheck size={18} color="white" />
          </div>
          <div>
            <h1 className="font-display text-lg text-primary leading-none">Admin Dashboard</h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-primary/50 mt-0.5">
              Twin Care Hospital
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center bg-cream rounded-lg p-1 border border-border">
          <Link 
            to="/admin/dashboard" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
          >
            Messages
          </Link>
          <Link 
            to="/admin/appointments" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/appointments' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
          >
            Appointments
          </Link>
          <Link 
            to="/admin/doctors" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/doctors' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
          >
            Doctors
          </Link>
          <Link 
            to="/admin/news" 
            className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/news' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
          >
            News
          </Link>
        </div>
      </div>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 font-body text-sm text-primary/60 hover:text-accent transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  )
}
