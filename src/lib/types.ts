export type JobStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'wishlist'

export interface JobApplication {
  id: string
  job_title: string
  company_name: string
  job_description: string | null
  job_url: string | null
  status: JobStatus
  applied_date: string | null
  follow_up_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface JobApplicationFormData {
  job_title: string
  company_name: string
  job_description: string
  job_url: string
  status: JobStatus
  applied_date: string
  follow_up_date: string
  notes: string
}

export interface DashboardStats {
  total: number
  interviews: number
  offers: number
  rejections: number
}

export interface ParsedJD {
  role: string
  skills: string[]
  salary: string
  location: string
}
