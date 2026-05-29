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
      className="fixed top-0 left-0 h-full w-60 flex flex-col z-30 bg-[#FFFFFF] border-r border-[#E5E7EB] select-none"
    >
      {/* Logo: JobX */}
      <div className="px-6 py-6 border-b border-[#E5E7EB]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Briefcase className="w-5 h-5 text-[#3B82F6]" strokeWidth={2.5} />
          <span className="text-lg font-bold text-[#111827] tracking-tight">JobX</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
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
              <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#111827]' : 'text-[#6B7280]'}`} />
              <span className="flex-1">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer version info */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <p className="text-xs text-center text-[#9CA3AF] font-medium tracking-wide">
          v1.0
        </p>
      </div>
    </aside>
  )
}
