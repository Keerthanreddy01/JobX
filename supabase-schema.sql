-- JobX Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_description TEXT,
  job_url TEXT,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'offer', 'rejected', 'wishlist')),
  applied_date DATE,
  follow_up_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own applications
CREATE POLICY "Users can view their own applications"
  ON public.job_applications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.job_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.job_applications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON public.job_applications
  FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_job_applications_updated
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at DESC);
