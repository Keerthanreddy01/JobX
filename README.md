# JobX® — AI-Powered Job Application Tracker

JobX is a cinematic, single-page application tracker designed for deep thinkers and bold builders who want a clean, quiet space to manage their careers.

Featuring a beautiful **liquid-glass hero** layout with hardware-accelerated **60 FPS smooth scrolling**, JobX simplifies job application tracking, cover letter drafting, and deadline management.

---

## ✨ Features

- **Cinematic Landing Page**: Built with a fullscreen looping background video, glassmorphic headers, and smooth delayed entry animations.
- **Dead-Simple Board**: Manage job applications from initial wishlist to interviews and offers without bloated forms or walls.
- **NVIDIA NIM Integration**: Unified deep learning cover letter composition and JD parsing powered by **DeepSeek-R1** at sub-400ms speeds.
- **Privacy First**: Fully public access system without complex auth steps or login walls.

---

## 🛠️ Tech Stack

- **Core**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom HSL Glassmorphism Variables
- **Database**: Supabase (Database + Row-level security policies)
- **AI Engine**: NVIDIA NIM Chat completions API

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Keerthanreddy01/JobX.git
cd JobX/jobx-app
```

### 2. Configure Environment variables
Create a `.env.local` file in the root of the `jobx-app` directory matching the following structure (these are kept safe locally and not committed to GitHub):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to experience the journey.

---

## 🛡️ RLS Database Schema

To initialize the public database, run the following SQL scripts inside the Supabase editor:

```sql
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied',
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  job_url TEXT,
  notes TEXT,
  skills_required TEXT[],
  experience_level TEXT,
  salary TEXT,
  location TEXT,
  responsibilities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access"
ON job_applications FOR ALL
USING (true)
WITH CHECK (true);
```
