import { DataProvider } from "@/lib/data-context"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DataProvider>
      <div className="min-h-screen bg-[#F3F4F6]">
        <Sidebar />
        <main className="lg:ml-[210px] min-h-screen p-4 pt-16 lg:pt-4 lg:p-6">
          {children}
        </main>
      </div>
    </DataProvider>
  )
}
