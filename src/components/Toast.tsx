'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const STYLES = {
  success: {
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    icon: '#10b981',
    text: '#6ee7b7',
  },
  error: {
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
    icon: '#ef4444',
    text: '#fca5a5',
  },
  info: {
    bg: 'rgba(124,58,237,0.1)',
    border: 'rgba(124,58,237,0.25)',
    icon: '#a855f7',
    text: '#c4b5fd',
  },
}

export function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)
  const Icon = ICONS[type]
  const style = STYLES[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        maxWidth: '380px',
        minWidth: '260px',
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: style.icon }} />
      <p className="text-sm flex-1 leading-snug" style={{ color: style.text }}>
        {message}
      </p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: style.text }}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Toast container + manager hook ──────────────────────────────────────────

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const toast = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  }

  return { toasts, removeToast, toast }
}
