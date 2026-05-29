import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JobStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; dot: string }> = {
  applied: {
    label: 'Applied',
    color: 'text-blue-300',
    bg: 'bg-blue-500/10 border border-blue-500/20 text-blue-300',
    dot: 'bg-blue-400',
  },
  interview: {
    label: 'Interview',
    color: 'text-amber-300',
    bg: 'bg-amber-500/10 border border-amber-500/20 text-amber-300',
    dot: 'bg-amber-400',
  },
  offer: {
    label: 'Offer',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-300',
    bg: 'bg-red-500/10 border border-red-500/20 text-red-300',
    dot: 'bg-red-400',
  },
  wishlist: {
    label: 'Wishlist',
    color: 'text-slate-300',
    bg: 'bg-white/5 border border-white/10 text-slate-300',
    dot: 'bg-slate-400',
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
