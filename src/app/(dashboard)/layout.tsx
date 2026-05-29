import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-[#F8F7FF] relative select-none">
      {/* Premium Dark Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-60 min-h-screen bg-[#F8F7FF]">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
