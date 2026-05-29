import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ApplicationForm from '@/components/ApplicationForm'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDate, STATUS_CONFIG } from '@/lib/utils'

export const metadata = { title: 'Edit Application — JobX' }

export default async function EditApplicationPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: app } = await supabase
    .from('job_applications')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!app) notFound()

  const config = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/dashboard/applications" className="btn-ghost mb-4 inline-flex text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">{app.job_title}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {app.company_name} · Applied {formatDate(app.applied_date)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`status-badge ${config.bg} ${config.color}`}>
              <span className={`status-dot ${config.dot}`} />
              {config.label}
            </span>
            {app.job_url && (
              <a
                href={app.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost p-2"
                title="Open job posting"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      <ApplicationForm existing={app} />
    </div>
  )
}
