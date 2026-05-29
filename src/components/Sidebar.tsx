'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  ChevronRight,
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
      className="fixed top-0 left-0 h-full w-60 flex flex-col z-20 bg-white border-r border-[#e9ecef] shadow-sm select-none"
    >
      {/* Logo: JobX */}
      <div className="px-6 py-6 border-b border-[#f1f3f5]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center shadow-md shadow-[#7C3AED]/10 group-hover:scale-[1.03] transition-transform duration-200">
            <Briefcase className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-[#1A1A1A] tracking-tight">JobX</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-wider text-[#8E8E93]">
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
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#7C3AED]' : 'text-[#8E8E93]'}`} />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#7C3AED] opacity-75" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-[#f1f3f5]">
        <p className="text-[11px] text-center text-[#8E8E93] font-medium tracking-wide">
          JobX · AI Job Tracker
        </p>
      </div>
    </aside>
  )
}
