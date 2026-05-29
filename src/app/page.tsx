'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function HomePage() {
  // Smooth scroll helper for active links
  useEffect(() => {
    const handleScroll = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash && target.hash.startsWith('#')) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    }
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleScroll as EventListener)
    })
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleScroll as EventListener)
      })
    }
  }, [])

  return (
    <div id="top" className="landing-page relative min-h-screen w-full overflow-y-auto flex flex-col justify-between select-none scroll-smooth">
      
      {/* Fullscreen Looping Video Background - FIXED for scrolling overlay depth */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      {/* Glassmorphic Navigation Bar - FIXED at top with backdrop blur */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md bg-black/10 border-b border-white/5 transition-all duration-300">
        <nav className="flex flex-row justify-between items-center px-8 py-5 max-w-7xl mx-auto">
          {/* Logo: JobX® */}
          <a
            href="#top"
            className="text-3xl tracking-tight text-white hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            JobX<sup className="text-xs font-light">®</sup>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#top"
              className="text-sm font-medium text-white transition-colors"
            >
              Home
            </a>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#studio"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
            >
              Studio
            </a>
            <a
              href="#journal"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
            >
              Journal
            </a>
            <a
              href="#reach-us"
              className="text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-white transition-colors"
            >
              Reach Us
            </a>
          </div>

          {/* CTA Button */}
          <Link
            href="/dashboard"
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white font-medium hover:scale-[1.03] transition-transform duration-300 active:scale-95"
          >
            Begin Journey
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 flex flex-col justify-center items-center text-center px-6 min-h-screen pt-32 pb-24">
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where <em className="not-italic text-[hsl(var(--muted-foreground))]">dreams</em> rise <br className="hidden sm:inline" />
          <em className="not-italic text-[hsl(var(--muted-foreground))]">through the silence.</em>
        </h1>

        <p className="text-[hsl(var(--muted-foreground))] text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          We&apos;re designing tools for deep thinkers, bold creators, and quiet rebels.
          Amid the chaos of the job hunt, JobX builds digital spaces for sharp focus,
          AI-generated cover letters, and inspired career work.
        </p>

        <a
          href="#features"
          className="liquid-glass rounded-full px-14 py-5 text-base text-white font-medium mt-12 hover:scale-[1.03] transition-transform duration-300 cursor-pointer animate-fade-rise-delay-2 active:scale-95"
        >
          Begin Journey
        </a>
      </section>

      {/* SECTION 1: FEATURES */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-32 w-full border-t border-white/5 bg-black/10 backdrop-blur-[2px]">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-normal text-white max-w-lg leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Crafted for <em className="not-italic text-[hsl(var(--muted-foreground))]">the quiet achiever.</em>
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] max-w-md text-sm sm:text-base leading-relaxed mt-2">
            No noise. No tracking scripts. No clutter. Just a cinematic interface tailored specifically to organize your career goals, build drafts, and monitor deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="liquid-glass rounded-[24px] p-8 flex flex-col justify-between min-h-[300px] hover:translate-y-[-4px] transition-transform duration-300">
            <div>
              <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">01 / Intelligence</span>
              <h3 className="text-3xl text-white font-normal mt-4 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>AI Cover Letters</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mt-2">
                Generate high-impact, custom-tailored cover letters in seconds powered by the ultra-fast NVIDIA NIM DeepSeek v4 models.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-xs text-white">
              <span>DeepSeek-R1 Powered</span>
              <span className="opacity-50">→</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass rounded-[24px] p-8 flex flex-col justify-between min-h-[300px] hover:translate-y-[-4px] transition-transform duration-300">
            <div>
              <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">02 / Simplicity</span>
              <h3 className="text-3xl text-white font-normal mt-4 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Dead-Simple Board</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mt-2">
                Manage your job applications from initial wishlist to interviews and offers without bloated forms or tracking limits.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-xs text-white">
              <span>Dynamic RLS Storage</span>
              <span className="opacity-50">→</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass rounded-[24px] p-8 flex flex-col justify-between min-h-[300px] hover:translate-y-[-4px] transition-transform duration-300">
            <div>
              <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">03 / Privacy</span>
              <h3 className="text-3xl text-white font-normal mt-4 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>Absolute Freedom</h3>
              <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed mt-2">
                Enjoy a system completely stripped of complex auth layers, logins, or user walls. Pure full public access at your command.
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center text-xs text-white">
              <span>Open Public Access</span>
              <span className="opacity-50">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STUDIO */}
      <section id="studio" className="relative z-10 max-w-7xl mx-auto px-8 py-32 w-full border-t border-white/5 bg-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">Workflow Engine</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-normal text-white mt-4 mb-8 leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              The engine <br />
              beneath <em className="not-italic text-[hsl(var(--muted-foreground))]">the silence.</em>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white shrink-0">1</div>
                <div>
                  <h4 className="text-white font-medium text-base">Paste Description</h4>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 leading-relaxed">Simply drop the raw Job Description text. No manual parser configurations required.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white shrink-0">2</div>
                <div>
                  <h4 className="text-white font-medium text-base">AI Analysis</h4>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 leading-relaxed">Our unified NVIDIA NIM API reads skills, salaries, roles, and locations automatically.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white shrink-0">3</div>
                <div>
                  <h4 className="text-white font-medium text-base">Perfect Submissions</h4>
                  <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1 leading-relaxed">Copy the customized cover letter drafts instantly, submit your resume, and win the offer.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="liquid-glass rounded-[32px] p-8 md:p-12 border border-white/10 relative overflow-hidden">
            {/* Visual aesthetic showing client mockup card */}
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">JobX Studio Mock</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Senior Staff Architect</h4>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">NVIDIA Corporation · Tech</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono uppercase">Applied</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[hsl(var(--muted-foreground))]">Remote</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[hsl(var(--muted-foreground))]">$190k - $240k</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 opacity-60">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Full-Stack Engineer</h4>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">Vercel Inc. · Design</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white font-mono uppercase">Interview</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 text-center">
                <Link href="/dashboard" className="text-xs text-white hover:underline transition-all">Go to Live Dashboard →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: JOURNAL & REACH US */}
      <section id="journal" className="relative z-10 max-w-7xl mx-auto px-8 py-32 w-full border-t border-white/5 bg-black/10 backdrop-blur-[2px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Journal Entries */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">Journal & Philosophy</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-normal text-white mt-4 mb-10 leading-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              A record of <br />
              <em className="not-italic text-[hsl(var(--muted-foreground))]">progress and intent.</em>
            </h2>
            <div className="space-y-8 pr-0 lg:pr-8">
              <article className="border-b border-white/5 pb-6">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">May 2026 · Philosophy</span>
                <h4 className="text-lg text-white font-medium mt-1 mb-2">Refusal of the Bloat</h4>
                <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
                  Most modern career software requests too much info and wastes precious hours. JobX respects your focus and limits metrics to what matters: deadlines, target roles, and draft delivery.
                </p>
              </article>
              <article className="border-b border-white/5 pb-6">
                <span className="text-xs text-[hsl(var(--muted-foreground))]">March 2026 · AI Integration</span>
                <h4 className="text-lg text-white font-medium mt-1 mb-2">Harnessing NVIDIA NIM</h4>
                <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">
                  By communicating directly with Nvidia API endpoints using DeepSeek models, we keep processing speeds below 400ms, providing instant letter composition.
                </p>
              </article>
            </div>
          </div>

          {/* Reach Us Form */}
          <div id="reach-us" className="flex flex-col justify-center">
            <div className="liquid-glass rounded-[32px] p-8 md:p-12 border border-white/5">
              <span className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] font-medium">Stay in Touch</span>
              <h3 className="text-3xl text-white font-normal mt-2 mb-6" style={{ fontFamily: "'Instrument Serif', serif" }}>Connect with the creators.</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5 font-medium">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email to receive quiet updates"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1.5 font-medium">Message</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you're building..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full liquid-glass rounded-xl py-3 text-sm text-white font-medium hover:scale-[1.01] transition-transform duration-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER - Glassmorphic, matches landing page theme */}
      <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 py-12 text-center text-xs text-[hsl(var(--muted-foreground))] font-light tracking-wide backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg text-white font-normal tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>JobX®</span>
            <span className="opacity-40">|</span>
            <span>Where dreams rise through the silence.</span>
          </div>
          <div className="flex gap-6">
            <a href="#top" className="hover:text-white transition-colors">Top</a>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#studio" className="hover:text-white transition-colors">Studio</a>
            <a href="#journal" className="hover:text-white transition-colors">Journal</a>
          </div>
          <div>
            © {new Date().getFullYear()} JobX Corporation. Quiet focus.
          </div>
        </div>
      </footer>
    </div>
  )
}
