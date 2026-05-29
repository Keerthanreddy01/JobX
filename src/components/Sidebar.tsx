'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  ChevronRight,
  Cpu,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/applications', label: 'Applications', icon: Briefcase },
  { href: '/dashboard/add', label: 'Add Application', icon: PlusCircle },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed top-0 left-0 h-full w-60 flex flex-col z-20"
      style={{ background: 'rgba(10,10,15,0.95)', borderRight: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <path d="M6 8h4M6 11h8"/>
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">JobX</span>
        </Link>
      </div>

      {/* NVIDIA NIM Badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(118,185,0,0.08)', border: '1px solid rgba(118,185,0,0.2)' }}>
          <Cpu className="w-3.5 h-3.5" style={{ color: '#76b900' }} />
          <span className="text-xs font-medium" style={{ color: '#a3d44a' }}>NVIDIA NIM · DeepSeek R1</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          JobX · AI Job Tracker
        </p>
      </div>
    </aside>
  )
}
