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

  const getCompanyBadgeColor = (char: string) => {
    const code = char.toUpperCase().charCodeAt(0) % 5
    const colors = [
      { bg: 'bg-[#E8E4FF]', text: 'text-[#7C3AED]' }, // Lavender
      { bg: 'bg-[#FFE4EC]', text: 'text-[#DB2777]' }, // Pink
      { bg: 'bg-[#FFF0E4]', text: 'text-[#EA580C]' }, // Peach
      { bg: 'bg-[#E4F0FF]', text: 'text-[#2563EB]' }, // Blue
      { bg: 'bg-[#E6F4EA]', text: 'text-[#137333]' }, // Green
    ]
    return colors[isNaN(code) ? 0 : code]
  }

  const statCards = [
    {
      label: 'Total Applied',
      value: stats.total,
      icon: Briefcase,
      color: '#7C3AED',
      bg: '#E8E4FF',
    },
    {
      label: 'Interviews Scheduled',
      value: stats.interviews,
      icon: Calendar,
      color: '#DB2777',
      bg: '#FFE4EC',
    },
    {
      label: 'Offers Received',
      value: stats.offers,
      icon: TrendingUp,
      color: '#EA580C',
      bg: '#FFF0E4',
    },
    {
      label: 'Rejections',
      value: stats.rejections,
      icon: XCircle,
      color: '#2563EB',
      bg: '#E4F0FF',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in pr-2 select-none text-[#111827]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Track and manage your active career applications.
          </p>
        </div>
        <Link 
          href="/dashboard/add" 
          id="dashboard-add-btn" 
          className="btn-primary"
        >
          <Plus className="w-4 h-4 text-white" />
          Add Application
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-[20px] p-6 flex flex-col justify-between min-h-[140px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            style={{ backgroundColor: bg }}
          >
            <div className="flex justify-between items-start">
              <span className="text-[13px] font-semibold text-[#5C5A6E] tracking-tight">{label}</span>
              <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.01)] flex items-center justify-center">
                <Icon className="w-4 h-4 shrink-0" style={{ color }} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[40px] font-bold text-neutral-900 leading-none tracking-tight">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-[#111827] flex items-center gap-2 text-base">
                <Clock className="w-4.5 h-4.5 text-[#6B7280]" />
                Recent Applications
              </h2>
              <Link 
                href="/dashboard/applications" 
                className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentApps.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-[#9CA3AF] opacity-40" />
                <p className="text-sm font-semibold text-[#6B7280]">Add your first application to get started</p>
                <Link href="/dashboard/add" className="mt-4 inline-flex btn-primary text-sm">
                  <Plus className="w-4 h-4 text-white" /> Add Application
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFBFD] border-b border-[#F3F4F6]">
                      <th className="px-6 py-3.5 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Applied</th>
                      <th className="px-6 py-3.5 text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Follow-Up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {recentApps.map(app => {
                      const config = STATUS_CONFIG[app.status]
                      const initial = app.company_name ? app.company_name.charAt(0).toUpperCase() : '?'
                      const badgeColor = getCompanyBadgeColor(initial)
                      return (
                        <tr 
                          key={app.id}
                          className="group cursor-pointer hover:bg-[#F8F7FF] h-14 transition-colors"
                        >
                          <td className="px-6 py-3">
                            <Link href={`/dashboard/applications/${app.id}`} className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${badgeColor.bg} ${badgeColor.text} font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}>
                                {initial}
                              </div>
                              <span className="font-semibold text-sm text-[#111827] group-hover:text-[#7C3AED] transition-colors truncate max-w-[140px]">
                                {app.company_name}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-3">
                            <Link href={`/dashboard/applications/${app.id}`} className="block">
                              <span className="text-sm text-[#6B7280] font-medium">{app.job_title}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-3">
                            <Link href={`/dashboard/applications/${app.id}`} className="inline-block">
                              <span className={`status-badge inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${config.bg}`}>
                                {config.label}
                              </span>
                            </Link>
                          </td>
                          <td className="px-6 py-3">
                            <Link href={`/dashboard/applications/${app.id}`} className="block text-xs text-[#6B7280] font-medium">
                              {formatDate(app.applied_date)}
                            </Link>
                          </td>
                          <td className="px-6 py-3">
                            <Link href={`/dashboard/applications/${app.id}`} className="block text-xs text-[#6B7280] font-medium">
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

        {/* Side Panel: Reminders & Metrics Card */}
        <div className="space-y-6">
          {/* Reminders Card */}
          <div className="bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4.5 border-b border-[#F3F4F6]">
              <h2 className="font-bold text-[#111827] flex items-center gap-2 text-base">
                <Bell className="w-4.5 h-4.5 text-[#6B7280]" />
                Reminders
              </h2>
              {overdueFollowUps.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#B91C1C]">
                  {overdueFollowUps.length} overdue
                </span>
              )}
            </div>

            <div className="p-4 space-y-3">
              {overdueFollowUps.length === 0 && dueSoonFollowUps.length === 0 ? (
                <div className="text-center py-10">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-[#9CA3AF] opacity-40" />
                  <p className="text-xs text-[#6B7280]">No upcoming follow-ups</p>
                </div>
              ) : (
                <>
                  {overdueFollowUps.map(app => (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="block p-3.5 rounded-[14px] border border-[#EF4444]/10 bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-[#EF4444] mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#111827] truncate">{app.company_name}</p>
                          <p className="text-xs text-[#6B7280] truncate mt-0.5">{app.job_title}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[9px] font-bold text-[#B91C1C] bg-white/80 border border-[#FEE2E2] rounded px-1.5 py-0.5 uppercase tracking-wide">
                              Overdue
                            </span>
                            <span className="text-[10px] text-[#B91C1C] font-semibold">{formatDate(app.follow_up_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {dueSoonFollowUps.map(app => (
                    <Link
                      key={app.id}
                      href={`/dashboard/applications/${app.id}`}
                      className="block p-3.5 rounded-[14px] border border-[#F59E0B]/10 bg-[#FFFBEB] hover:bg-[#FEF3C7] transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#111827] truncate">{app.company_name}</p>
                          <p className="text-xs text-[#6B7280] truncate mt-0.5">{app.job_title}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[9px] font-bold text-[#B45309] bg-white/80 border border-[#FEF3C7] rounded px-1.5 py-0.5 uppercase tracking-wide">
                              Upcoming
                            </span>
                            <span className="text-[10px] text-[#B45309] font-semibold">{formatDate(app.follow_up_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick stats / Progress bars Card */}
          {apps.length > 0 && (
            <div className="bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[20px] p-5">
              <h3 className="text-sm font-bold text-[#111827] mb-4">Response Distribution</h3>
              <div className="space-y-3.5">
                {(['applied', 'interview', 'offer', 'rejected', 'wishlist'] as const).map(status => {
                  const count = apps.filter(a => a.status === status).length
                  const pct = apps.length > 0 ? Math.round((count / apps.length) * 100) : 0
                  const cfg = STATUS_CONFIG[status]
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[#6B7280] font-medium">{cfg.label}</span>
                        <span className="text-[#111827] font-semibold">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ 
                            width: `${pct}%`, 
                            backgroundColor: cfg.dot === 'bg-[#1D4ED8]' ? '#3B82F6' : 
                                       cfg.dot === 'bg-[#B45309]' ? '#F59E0B' : 
                                       cfg.dot === 'bg-[#15803D]' ? '#10B981' : 
                                       cfg.dot === 'bg-[#B91C1C]' ? '#EF4444' : '#6B7280'
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
