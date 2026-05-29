'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { JobApplication, JobStatus } from '@/lib/types'
import { STATUS_CONFIG, formatDate, isOverdue } from '@/lib/utils'
import { Search, Plus, Filter, ExternalLink, Clock, AlertCircle, ChevronRight, Briefcase } from 'lucide-react'

const ALL_STATUSES: { value: JobStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'wishlist', label: '⭐ Wishlist' },
  { value: 'applied', label: '📤 Applied' },
  { value: 'interview', label: '🗓 Interview' },
  { value: 'offer', label: '🎉 Offer' },
  { value: 'rejected', label: '❌ Rejected' },
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
    <div className="space-y-6 animate-fade-in pr-2 select-none text-[#111827]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Applications</h1>
          <p className="text-sm mt-1 text-[#6B7280]">
            {applications.length} total · {filtered.length} shown
          </p>
        </div>
        <Link 
          href="/dashboard/add" 
          id="add-application-btn" 
          className="btn-primary"
        >
          <Plus className="w-4 h-4 text-white" /> Add Application
        </Link>
      </div>

      {/* Filters Card */}
      <div className="glass-card bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-[12px] shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6B7280]" />
            <input
              id="applications-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 h-10 border-[#E5E7EB]"
              placeholder="Search by company or job title…"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold text-[#6B7280] flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {ALL_STATUSES.map(({ value, label }) => {
                const isSelected = statusFilter === value
                return (
                  <button
                    key={value}
                    id={`filter-${value}`}
                    onClick={() => setStatusFilter(value)}
                    className="text-xs px-3.5 py-2 rounded-lg font-semibold transition-all select-none border"
                    style={
                      isSelected
                        ? { 
                            backgroundColor: '#F3F0FF', 
                            color: '#7C3AED', 
                            borderColor: '#7C3AED',
                          }
                        : { 
                            backgroundColor: '#FFFFFF', 
                            color: '#6B7280', 
                            borderColor: '#E5E7EB',
                          }
                    }
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Applications List Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card bg-[#FFFFFF] border border-[#E5E7EB] p-16 text-center rounded-[12px] shadow-sm">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-[#6B7280] opacity-40" />
          <p className="font-semibold text-[#111827] mb-1">No applications found</p>
          <p className="text-sm text-[#6B7280]">
            {search || statusFilter !== 'all' ? 'Try adjusting your search query or filter settings' : 'Add your first job application to get started!'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link href="/dashboard/add" className="mt-4 btn-primary inline-flex">
              <Plus className="w-4 h-4 text-white" /> Add Application
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const config = STATUS_CONFIG[app.status]
            const overdue = app.follow_up_date && isOverdue(app.follow_up_date) && app.status !== 'rejected' && app.status !== 'offer'

            return (
              <Link
                key={app.id}
                href={`/dashboard/applications/${app.id}`}
                className="glass-card bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] flex items-center gap-5 px-6 py-4.5 group hover:bg-[#F9FAFB] transition-all duration-150 shadow-sm"
              >
                {/* Thick Status left border helper */}
                <div
                  className={`w-1 rounded-full flex-shrink-0 self-stretch ${config.dot}`}
                  style={{ minHeight: '30px' }}
                />

                {/* Company & Role Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#111827] truncate group-hover:text-[#7C3AED] transition-colors">
                      {app.job_title}
                    </p>
                    {app.job_url && (
                      <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] opacity-50 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#6B7280] font-medium mt-1">
                    {app.company_name}
                  </p>
                </div>

                {/* Dates & Follow-ups info */}
                <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                  {app.follow_up_date && (
                    <div 
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                        overdue 
                          ? 'text-[#B91C1C] bg-[#FEF2F2] border border-[#FEE2E2]' 
                          : 'text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB]'
                      }`}
                    >
                      {overdue ? (
                        <AlertCircle className="w-3 h-3 text-[#EF4444] shrink-0" />
                      ) : (
                        <Clock className="w-3 h-3 text-[#6B7280] shrink-0" />
                      )}
                      <span>
                        {overdue ? 'Overdue' : 'Follow-up'}: {formatDate(app.follow_up_date)}
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-[#6B7280] font-medium">
                    Applied: {formatDate(app.applied_date)}
                  </p>
                </div>

                {/* Status Badges */}
                <span className={`status-badge flex-shrink-0 flex items-center px-3 py-1.5 text-xs font-semibold rounded-full ${config.bg}`}>
                  <span>{config.label}</span>
                </span>

                {/* Arrow Navigation trigger */}
                <ChevronRight className="w-5 h-5 flex-shrink-0 text-[#6B7280] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
