'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { JobApplication, JobApplicationFormData, JobStatus } from '@/lib/types'
import AIModal from './AIModal'
import { ToastContainer, useToast } from './Toast'
import {
  Save, Trash2, Wand2, FileSearch, Loader2, Link as LinkIcon,
  Building2, Briefcase, Calendar, FileText, StickyNote, AlertCircle, Cpu
} from 'lucide-react'

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'wishlist', label: '⭐ Wishlist' },
  { value: 'applied', label: '📤 Applied' },
  { value: 'interview', label: '🗓 Interview' },
  { value: 'offer', label: '🎉 Offer' },
  { value: 'rejected', label: '❌ Rejected' },
]

const DEFAULT_FORM: JobApplicationFormData = {
  job_title: '',
  company_name: '',
  job_description: '',
  job_url: '',
  status: 'applied',
  applied_date: new Date().toISOString().split('T')[0],
  follow_up_date: '',
  notes: '',
}

interface ApplicationFormProps {
  existing?: JobApplication
}

export default function ApplicationForm({ existing }: ApplicationFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<JobApplicationFormData>(
    existing
      ? {
          job_title: existing.job_title,
          company_name: existing.company_name,
          job_description: existing.job_description || '',
          job_url: existing.job_url || '',
          status: existing.status,
          applied_date: existing.applied_date || '',
          follow_up_date: existing.follow_up_date || '',
          notes: existing.notes || '',
        }
      : DEFAULT_FORM
  )

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [aiLoading, setAiLoading] = useState<'parse' | 'cover' | null>(null)
  const { toasts, removeToast, toast } = useToast()
  const [modal, setModal] = useState<{ open: boolean; title: string; content: string; type: 'cover-letter' | 'parsed-jd' }>({
    open: false,
    title: '',
    content: '',
    type: 'cover-letter',
  })

  const set = (field: keyof JobApplicationFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    const payload = {
      ...form,
      applied_date: form.applied_date || null,
      follow_up_date: form.follow_up_date || null,
      job_description: form.job_description || null,
      job_url: form.job_url || null,
      notes: form.notes || null,
    }

    let err
    if (existing) {
      ;({ error: err } = await supabase
        .from('job_applications')
        .update(payload)
        .eq('id', existing.id))
    } else {
      ;({ error: err } = await supabase.from('job_applications').insert(payload))
    }

    if (err) {
      setError(err.message)
      setSaving(false)
    } else {
      router.push('/dashboard/applications')
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!existing || !confirm('Delete this application? This cannot be undone.')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('job_applications').delete().eq('id', existing.id)
    router.push('/dashboard/applications')
    router.refresh()
  }

  const handleParseJD = async () => {
    if (!form.job_description.trim()) {
      toast.error('Please paste a job description first.')
      return
    }
    setAiLoading('parse')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'parse',
          job_description: form.job_description,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to parse JD')

      let formatted = ''
      try {
        const jsonMatch = (data.result as string).match(/\{[\s\S]*\}/)
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
        if (parsed) {
          const skills = (parsed.skills_required || []).map((s: string) => `  • ${s}`).join('\n')
          const resp  = (parsed.responsibilities  || []).map((r: string) => `  • ${r}`).join('\n')
          formatted =
            `📋 PARSED JOB DESCRIPTION\n\n` +
            `🎯 Experience Level: ${parsed.experience_level || 'N/A'}\n\n` +
            `📍 Location: ${parsed.location || 'N/A'}\n\n` +
            `💰 Salary: ${parsed.salary || 'Not mentioned'}\n\n` +
            `🛠 Skills Required:\n${skills || '  N/A'}\n\n` +
            `📌 Key Responsibilities:\n${resp || '  N/A'}`
        } else {
          formatted = data.result
        }
      } catch {
        formatted = data.result
      }

      setModal({ open: true, title: 'Parsed Job Description', content: formatted, type: 'parsed-jd' })
      toast.success('Job description parsed successfully!')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'AI parsing failed'
      toast.error(msg)
    } finally {
      setAiLoading(null)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!form.job_title || !form.company_name) {
      toast.error('Please fill in Job Title and Company Name first.')
      return
    }
    setAiLoading('cover')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cover_letter',
          job_title: form.job_title,
          company_name: form.company_name,
          job_description: form.job_description,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate cover letter')
      setModal({ open: true, title: 'AI Cover Letter', content: data.result, type: 'cover-letter' })
      toast.success('Cover letter generated!')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Cover letter generation failed'
      toast.error(msg)
    } finally {
      setAiLoading(null)
    }
  }

  return (
    <>
      <form onSubmit={handleSave} className="space-y-6 select-none pb-12 pr-2 text-[#111827]">
        {error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#EF4444]/20 text-[#B91C1C] text-sm font-medium">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-[#EF4444]" />
            {error}
          </div>
        )}

        {/* Core fields card */}
        <div className="glass-card bg-[#FFFFFF] border border-[#E5E7EB] p-6 space-y-6 rounded-[12px] shadow-sm">
          <h2 className="font-semibold text-[#111827] flex items-center gap-2 text-base border-b border-[#E5E7EB] pb-3">
            <Briefcase className="w-4.5 h-4.5 text-[#6B7280]" />
            Job Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1.5" htmlFor="job-title">
                Job Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  id="job-title"
                  type="text"
                  value={form.job_title}
                  onChange={set('job_title')}
                  className="input-field pl-10 border-[#E5E7EB]"
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1.5" htmlFor="company-name">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  id="company-name"
                  type="text"
                  value={form.company_name}
                  onChange={set('company_name')}
                  className="input-field pl-10 border-[#E5E7EB]"
                  placeholder="e.g. Google"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1.5" htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={set('status')}
                className="input-field border-[#E5E7EB] cursor-pointer bg-[#FFFFFF]"
              >
                {STATUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="bg-[#FFFFFF] text-[#111827]">{o.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1.5" htmlFor="job-url">Job URL (optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  id="job-url"
                  type="url"
                  value={form.job_url}
                  onChange={set('job_url')}
                  className="input-field pl-10 border-[#E5E7EB]"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1.5" htmlFor="applied-date">Application Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  id="applied-date"
                  type="date"
                  value={form.applied_date}
                  onChange={set('applied_date')}
                  className="input-field pl-10 border-[#E5E7EB] cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#6B7280] mb-1.5" htmlFor="follow-up-date">Follow-up Date (optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  id="follow-up-date"
                  type="date"
                  value={form.follow_up_date}
                  onChange={set('follow_up_date')}
                  className="input-field pl-10 border-[#E5E7EB] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Description + AI card */}
        <div className="glass-card bg-[#FFFFFF] border border-[#E5E7EB] p-6 space-y-4 rounded-[12px] shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="font-semibold text-[#111827] flex items-center gap-2 text-base">
                <FileText className="w-4.5 h-4.5 text-[#6B7280]" />
                Job Description
              </h2>
              {/* NVIDIA light badge */}
              <div className="flex items-center gap-1.5 mt-1 bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] rounded px-2 py-0.5 w-max">
                <Cpu className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wide">NVIDIA NIM · DeepSeek R1</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                id="parse-jd-btn"
                onClick={handleParseJD}
                disabled={!!aiLoading}
                className="btn-secondary text-xs py-2 px-3.5 font-semibold border-[#E5E7EB] bg-[#FFFFFF] hover:bg-[#F9FAFB] text-[#6B7280]"
              >
                {aiLoading === 'parse' ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing...</>
                ) : (
                  <><FileSearch className="w-3.5 h-3.5 text-[#6B7280]" /> Parse JD</>
                )}
              </button>
              <button
                type="button"
                id="cover-letter-btn"
                onClick={handleGenerateCoverLetter}
                disabled={!!aiLoading}
                className="btn-primary text-xs py-2 px-3.5 font-semibold text-white"
              >
                {aiLoading === 'cover' ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> Generating...</>
                ) : (
                  <><Wand2 className="w-3.5 h-3.5 text-white" /> Cover Letter</>
                )}
              </button>
            </div>
          </div>
          <textarea
            id="job-description"
            value={form.job_description}
            onChange={set('job_description')}
            className="input-field resize-none border-[#E5E7EB]"
            placeholder="Paste the full job description here… NVIDIA DeepSeek R1 will automatically extract experience level, salary, skills, and responsibilities."
            rows={8}
          />
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Paste the JD → Click <strong className="text-[#6B7280]">Parse JD</strong> to summarize keys, or <strong className="text-[#6B7280]">Cover Letter</strong> to craft paragraphs tailored for the role.
          </p>
        </div>

        {/* Notes card */}
        <div className="glass-card bg-[#FFFFFF] border border-[#E5E7EB] p-6 space-y-4 rounded-[12px] shadow-sm">
          <h2 className="font-semibold text-[#111827] flex items-center gap-2 text-base border-b border-[#E5E7EB] pb-3">
            <StickyNote className="w-4.5 h-4.5 text-[#6B7280]" />
            Notes
          </h2>
          <textarea
            id="notes"
            value={form.notes}
            onChange={set('notes')}
            className="input-field resize-none border-[#E5E7EB]"
            placeholder="Referral contacts, networking prep notes, compensation expectations, or next step drafts…"
            rows={4}
          />
        </div>

        {/* Actions panel */}
        <div className="flex items-center justify-between pt-2">
          {existing ? (
            <button
              type="button"
              id="delete-app-btn"
              onClick={handleDelete}
              disabled={deleting}
              className="btn-ghost text-[#B91C1C] hover:text-[#991B1B] hover:bg-[#FEF2F2] font-semibold text-sm flex items-center gap-1.5 border border-transparent rounded-lg px-3 py-2 transition-colors"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin text-[#B91C1C]" /> : <Trash2 className="w-4 h-4 text-[#B91C1C]" />}
              {deleting ? 'Deleting…' : 'Delete Application'}
            </button>
          ) : <div />}

          <button
            type="submit"
            id="save-app-btn"
            disabled={saving}
            className="btn-primary hover:scale-[1.02] active:scale-95 transition-transform"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin text-white" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4 text-white" /> {existing ? 'Save Changes' : 'Add Application'}</>
            )}
          </button>
        </div>
      </form>

      <AIModal
        isOpen={modal.open}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        title={modal.title}
        content={modal.content}
        type={modal.type}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
