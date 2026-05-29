import { createClient } from '@/lib/supabase/server'
import { JobApplication } from '@/lib/types'
import { formatDate, isOverdue, isDueSoon, STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import {
  Briefcase, Calendar, TrendingUp, XCircle, Clock, ArrowRight,
  Plus, AlertCircle, Bell
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard — JobX',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false })

  const apps: JobApplication[] = applications || []

  const stats = {
    total: apps.length,
    interviews: apps.filter(a => a.status === 'interview').length,
    offers: apps.filter(a => a.status === 'offer').length,
    rejections: apps.filter(a => a.status === 'rejected').length,
  }

  const recentApps = apps.slice(0, 5)

  const overdueFollowUps = apps.filter(
    a => a.follow_up_date && isOverdue(a.follow_up_date) && a.status !== 'rejected' && a.status !== 'offer'
  )
  const dueSoonFollowUps = apps.filter(
    a => a.follow_up_date && isDueSoon(a.follow_up_date) && !isOverdue(a.follow_up_date)
  )

  const statCards = [
    {
      label: 'Total Applied',
      value: stats.total,
      icon: Briefcase,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.1)',
      border: 'rgba(124,58,237,0.2)',
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      icon: Calendar,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.1)',
      border: 'rgba(245,158,11,0.2)',
    },
    {
      label: 'Offers Received',
      value: stats.offers,
      icon: TrendingUp,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'Rejections',
      value: stats.rejections,
      icon: XCircle,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.2)',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Job Application <span className="gradient-text">Tracker</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your job search overview
          </p>
        </div>
        <Link href="/dashboard/add" id="dashboard-add-btn" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Application
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div
            key={label}
            className="glass-card p-5"
            style={{ background: bg, borderColor: border }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: '#a855f7' }} />
                Recent Applications
              </h2>
              <Link href="/dashboard/applications" className="text-xs flex items-center gap-1" style={{ color: '#a855f7' }}>
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No applications yet</p>
                <Link href="/dashboard/add" className="mt-3 inline-flex btn-primary text-sm py-2">
                  <Plus className="w-3.5 h-3.5" /> Add your first one
                </Link>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {recentApps.map(app => {
                  const config = STATUS_CONFIG[app.status]
                  return (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="flex items-center justify-between px-6 py-4 group transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate group-hover:text-violet-300 transition-colors">
                          {app.job_title}
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                          {app.company_name} · {formatDate(app.applied_date)}
                        </p>
                      </div>
                      <span className={`status-badge ml-3 flex-shrink-0 ${config.bg} ${config.color}`}>
                        <span className={`status-dot ${config.dot}`} />
                        {config.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Follow-up reminders */}
        <div>
          <div className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <Bell className="w-4 h-4" style={{ color: '#a855f7' }} />
              <h2 className="font-semibold text-white">Reminders</h2>
              {overdueFollowUps.length > 0 && (
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {overdueFollowUps.length} overdue
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {overdueFollowUps.length === 0 && dueSoonFollowUps.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No upcoming follow-ups</p>
                </div>
              ) : (
                <>
                  {overdueFollowUps.map(app => (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="block p-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0 pulse-overdue" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-red-300 truncate">{app.job_title}</p>
                          <p className="text-xs text-red-400/70 truncate">{app.company_name}</p>
                          <p className="text-xs text-red-400 mt-1">Overdue · {formatDate(app.follow_up_date)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {dueSoonFollowUps.map(app => (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="block p-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-amber-300 truncate">{app.job_title}</p>
                          <p className="text-xs text-amber-400/70 truncate">{app.company_name}</p>
                          <p className="text-xs text-amber-400 mt-1">Due soon · {formatDate(app.follow_up_date)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick stats */}
          {apps.length > 0 && (
            <div className="glass-card p-5 mt-4">
              <h3 className="text-sm font-semibold text-white mb-3">Response Rate</h3>
              <div className="space-y-2">
                {(['applied', 'interview', 'offer', 'rejected', 'wishlist'] as const).map(status => {
                  const count = apps.filter(a => a.status === status).length
                  const pct = apps.length > 0 ? Math.round((count / apps.length) * 100) : 0
                  const cfg = STATUS_CONFIG[status]
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: 'var(--text-secondary)' }}>{cfg.label}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: cfg.dot.replace('bg-', '') }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
