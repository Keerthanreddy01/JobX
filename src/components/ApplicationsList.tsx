'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { JobApplication, JobStatus } from '@/lib/types'
import { STATUS_CONFIG, formatDate, isOverdue } from '@/lib/utils'
import { Search, Plus, Filter, ExternalLink, Clock, AlertCircle, ChevronRight } from 'lucide-react'

const ALL_STATUSES: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
]

interface ApplicationsListProps {
  applications: JobApplication[]
}

export default function ApplicationsList({ applications }: ApplicationsListProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        app.job_title.toLowerCase().includes(q) ||
        app.company_name.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [applications, search, statusFilter])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {applications.length} total · {filtered.length} shown
          </p>
        </div>
        <Link href="/dashboard/add" id="add-application-btn" className="btn-primary">
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              id="applications-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by company or job title…"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <div className="flex gap-1 flex-wrap">
              {ALL_STATUSES.map(({ value, label }) => (
                <button
                  key={value}
                  id={`filter-${value}`}
                  onClick={() => setStatusFilter(value)}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                  style={
                    statusFilter === value
                      ? { background: 'rgba(124,58,237,0.3)', color: '#c084fc', border: '1px solid rgba(124,58,237,0.4)' }
                      : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Applications grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium text-white mb-1">No applications found</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {search || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first application to get started'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link href="/dashboard/add" className="mt-4 btn-primary inline-flex">
              <Plus className="w-4 h-4" /> Add Application
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(app => {
            const config = STATUS_CONFIG[app.status]
            const overdue = app.follow_up_date && isOverdue(app.follow_up_date) && app.status !== 'rejected' && app.status !== 'offer'

            return (
              <Link
                key={app.id}
                href={`/dashboard/applications/${app.id}`}
                className="glass-card flex items-center gap-4 px-5 py-4 group cursor-pointer"
                style={{ display: 'flex' }}
              >
                {/* Status indicator */}
                <div
                  className={`w-1 self-stretch rounded-full flex-shrink-0 ${config.dot}`}
                />

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-violet-300 transition-colors">
                      {app.job_title}
                    </p>
                    {app.job_url && (
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-40" />
                    )}
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                    {app.company_name}
                  </p>
                </div>

                {/* Follow-up */}
                <div className="hidden sm:flex flex-col items-end gap-1">
                  {app.follow_up_date && (
                    <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : ''}`} style={!overdue ? { color: 'var(--text-muted)' } : {}}>
                      {overdue ? (
                        <AlertCircle className="w-3 h-3 pulse-overdue" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {overdue ? 'Overdue' : 'Follow-up'}: {formatDate(app.follow_up_date)}
                    </div>
                  )}
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(app.applied_date)}
                  </p>
                </div>

                {/* Status badge */}
                <span className={`status-badge flex-shrink-0 ${config.bg} ${config.color}`}>
                  <span className={`status-dot ${config.dot}`} />
                  <span className="hidden sm:inline">{config.label}</span>
                </span>

                <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5 transition-all" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
