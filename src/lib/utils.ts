import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JobStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; dot: string }> = {
  applied: {
    label: 'Applied',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border border-blue-200 text-blue-700',
    dot: 'bg-blue-500',
  },
  interview: {
    label: 'Interview',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border border-amber-200 text-amber-700',
    dot: 'bg-amber-500',
  },
  offer: {
    label: 'Offer',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bg: 'bg-red-50 border border-red-200 text-red-700',
    dot: 'bg-red-500',
  },
  wishlist: {
    label: 'Wishlist',
    color: 'text-gray-700',
    bg: 'bg-gray-50 border border-gray-200 text-gray-700',
    dot: 'bg-gray-400',
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
