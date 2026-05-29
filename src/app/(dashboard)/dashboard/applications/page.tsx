import { createClient } from '@/lib/supabase/server'
import ApplicationsList from '@/components/ApplicationsList'

export const metadata = { title: 'Applications — JobX' }

export default async function ApplicationsPage() {
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false })

  return <ApplicationsList applications={applications || []} />
}
