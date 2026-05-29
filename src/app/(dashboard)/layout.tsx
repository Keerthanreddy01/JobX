import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex relative overflow-hidden select-none">
      
      {/* Fullscreen Looping Video Background */}
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

      {/* Soft Dark Overlay to ensure 100% legibility */}
      <div className="fixed inset-0 bg-slate-950/70 z-10 pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <main className="flex-1 ml-60 min-h-screen relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
