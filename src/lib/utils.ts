import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JobStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; dot: string }> = {
  applied: {
    label: 'Applied',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20 border border-blue-500/30',
    dot: 'bg-blue-400',
  },
  interview: {
    label: 'Interview',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20 border border-amber-500/30',
    dot: 'bg-amber-400',
  },
  offer: {
    label: 'Offer',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/20 border border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-400',
    bg: 'bg-red-500/20 border border-red-500/30',
    dot: 'bg-red-400',
  },
  wishlist: {
    label: 'Wishlist',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20 border border-purple-500/30',
    dot: 'bg-purple-400',
  },
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  const date = new Date(dateString + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateString + 'T00:00:00')
  return date < today
}

export function isDueSoon(dateString: string | null): boolean {
  if (!dateString) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in3Days = new Date(today)
  in3Days.setDate(today.getDate() + 3)
  const date = new Date(dateString + 'T00:00:00')
  return date >= today && date <= in3Days
}
