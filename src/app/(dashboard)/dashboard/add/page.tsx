import ApplicationForm from '@/components/ApplicationForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Add Application — JobX' }

export default function AddApplicationPage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/dashboard/applications" className="btn-ghost mb-4 inline-flex text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Applications
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Application</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Track a new job and use AI to parse the JD or generate a cover letter
        </p>
      </div>
      <ApplicationForm />
    </div>
  )
}
