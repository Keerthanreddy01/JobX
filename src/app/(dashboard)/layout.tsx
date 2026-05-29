import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-[#F5F5F5] relative select-none">
      {/* Pure White Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-60 min-h-screen bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
