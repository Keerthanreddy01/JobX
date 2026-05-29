'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
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
      className="fixed top-0 left-0 h-full w-60 flex flex-col z-30 bg-[#111111] border-r border-neutral-900 select-none"
    >
      {/* Logo: JobX */}
      <div className="px-6 py-6 border-b border-neutral-900">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7C3AED] shadow-[0_2px_10px_rgba(124,58,237,0.3)] transition-transform group-hover:scale-105">
            <Briefcase className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">JobX</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
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
              className={`nav-item ${isActive ? 'active' : ''} mb-1`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-neutral-400'}`} />
              <span className="flex-1">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Account Info */}
      <div className="p-4 border-t border-neutral-900 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#E8E4FF] flex items-center justify-center font-bold text-xs text-[#7C3AED] shadow-sm">
          KR
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">Keerthan Reddy</p>
          <p className="text-[10px] text-neutral-500 truncate">Premium Member</p>
        </div>
      </div>
    </aside>
  )
}
