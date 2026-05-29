import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JobStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; dot: string }> = {
  applied: {
    label: 'Applied',
    color: 'text-[#1D4ED8]',
    bg: 'bg-[#EFF6FF] text-[#1D4ED8] border-none',
    dot: 'bg-[#1D4ED8]',
  },
  interview: {
    label: 'Interview',
    color: 'text-[#B45309]',
    bg: 'bg-[#FFFBEB] text-[#B45309] border-none',
    dot: 'bg-[#B45309]',
  },
  offer: {
    label: 'Offer',
    color: 'text-[#15803D]',
    bg: 'bg-[#F0FDF4] text-[#15803D] border-none',
    dot: 'bg-[#15803D]',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-[#B91C1C]',
    bg: 'bg-[#FEF2F2] text-[#B91C1C] border-none',
    dot: 'bg-[#B91C1C]',
  },
  wishlist: {
    label: 'Wishlist',
    color: 'text-[#374151]',
    bg: 'bg-[#F3F4F6] text-[#374151] border-none',
    dot: 'bg-[#374151]',
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
