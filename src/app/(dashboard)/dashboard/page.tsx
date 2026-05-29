import { createClient } from '@/lib/supabase/server'
import { JobApplication } from '@/lib/types'
import { formatDate, isOverdue, isDueSoon, STATUS_CONFIG } from '@/lib/utils'
import Link from 'next/link'
import {
  Briefcase, TrendingUp, Clock, ArrowRight,
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
      borderLeftClass: 'border-l-4 border-l-[#3b82f6]',
      color: '#3b82f6',
    },
    {
      label: 'Interviews Scheduled',
      value: stats.interviews,
      borderLeftClass: 'border-l-4 border-l-[#f59e0b]',
      color: '#f59e0b',
    },
    {
      label: 'Offers Received',
      value: stats.offers,
      borderLeftClass: 'border-l-4 border-l-[#10b981]',
      color: '#10b981',
    },
    {
      label: 'Rejections',
      value: stats.rejections,
      borderLeftClass: 'border-l-4 border-l-[#ef4444]',
      color: '#ef4444',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in pr-2 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#cbd5e1]">
            Track and manage your active career applications.
          </p>
        </div>
        <Link 
          href="/dashboard/add" 
          id="dashboard-add-btn" 
          className="btn-primary hover:scale-[1.02] active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 text-white" />
          Add Application
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(({ label, value, borderLeftClass, color }) => (
          <div
            key={label}
            className={`glass-card p-5 flex flex-col justify-between min-h-[110px] ${borderLeftClass}`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[13px] font-medium text-[#cbd5e1]">{label}</span>
              <TrendingUp className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                +12%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2 text-base">
                <Clock className="w-4.5 h-4.5 text-violet-400" />
                Recent Applications
              </h2>
              <Link 
                href="/dashboard/applications" 
                className="text-xs font-semibold text-violet-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-[#94a3b8] opacity-35" />
                <p className="text-sm font-medium text-[#cbd5e1]">Add your first application to get started</p>
                <Link href="/dashboard/add" className="mt-4 inline-flex btn-primary text-sm py-2">
                  <Plus className="w-4 h-4 text-white" /> Add Application
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-3.5 text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider">Applied</th>
                      <th className="px-6 py-3.5 text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider">Follow-Up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentApps.map(app => {
                      const config = STATUS_CONFIG[app.status]
                      return (
                        <tr 
                          key={app.id}
                          className="group cursor-pointer hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4.5">
                            <Link href={`/dashboard/applications/${app.id}`} className="block">
                              <span className="font-semibold text-sm text-white group-hover:text-violet-300 transition-colors">
                                {app.company_name}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4.5">
                            <Link href={`/dashboard/applications/${app.id}`} className="block">
                              <span className="text-sm text-[#cbd5e1] font-medium">{app.job_title}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4.5">
                            <Link href={`/dashboard/applications/${app.id}`} className="inline-block">
                              <span className={`status-badge inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${config.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                                {config.label}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-4.5">
                            <Link href={`/dashboard/applications/${app.id}`} className="block text-xs text-[#cbd5e1] font-medium">
                              {formatDate(app.applied_date)}
                            </Link>
                          </td>
                          <td className="px-6 py-4.5">
                            <Link href={`/dashboard/applications/${app.id}`} className="block text-xs text-[#cbd5e1] font-medium">
                              {app.follow_up_date ? formatDate(app.follow_up_date) : '—'}
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Reminders & Metrics */}
        <div className="space-y-6">
          {/* Reminders Section */}
          <div className="glass-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4.5 border-b border-white/5">
              <h2 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base">
                <Bell className="w-4 h-4 text-violet-400" />
                Reminders
              </h2>
              {overdueFollowUps.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                  {overdueFollowUps.length} overdue
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {overdueFollowUps.length === 0 && dueSoonFollowUps.length === 0 ? (
                <div className="text-center py-10">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-[#94a3b8] opacity-20" />
                  <p className="text-xs text-[#94a3b8]">No upcoming follow-ups</p>
                </div>
              ) : (
                <>
                  {overdueFollowUps.map(app => (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="block p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-red-300 truncate">{app.company_name}</p>
                          <p className="text-xs text-red-400/80 truncate mt-0.5">{app.job_title}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] font-bold text-red-300 bg-red-500/20 border border-red-500/30 rounded px-1.5 py-0.5 uppercase tracking-wide">
                              Overdue
                            </span>
                            <span className="text-[10px] text-red-300 font-medium">{formatDate(app.follow_up_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {dueSoonFollowUps.map(app => (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="block p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-amber-300 truncate">{app.company_name}</p>
                          <p className="text-xs text-amber-400/80 truncate mt-0.5">{app.job_title}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded px-1.5 py-0.5 uppercase tracking-wide">
                              Upcoming
                            </span>
                            <span className="text-[10px] text-amber-600 font-medium">{formatDate(app.follow_up_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick stats / Progress bar */}
          {apps.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Response Distribution</h3>
              <div className="space-y-3.5">
                {(['applied', 'interview', 'offer', 'rejected', 'wishlist'] as const).map(status => {
                  const count = apps.filter(a => a.status === status).length
                  const pct = apps.length > 0 ? Math.round((count / apps.length) * 100) : 0
                  const cfg = STATUS_CONFIG[status]
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#cbd5e1] font-medium">{cfg.label}</span>
                        <span className="text-[#cbd5e1] font-semibold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ 
                            width: `${pct}%`, 
                            backgroundColor: cfg.dot.includes('bg-') ? '' : cfg.dot,
                            background: cfg.dot === 'bg-blue-500' || cfg.dot === 'bg-blue-400' ? '#60a5fa' : 
                                       cfg.dot === 'bg-amber-500' || cfg.dot === 'bg-amber-400' ? '#fbbf24' : 
                                       cfg.dot === 'bg-emerald-500' || cfg.dot === 'bg-emerald-400' ? '#34d399' : 
                                       cfg.dot === 'bg-red-500' || cfg.dot === 'bg-red-400' ? '#f87171' : '#cbd5e1'
                          }}
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
