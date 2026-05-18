"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Dumbbell, ClipboardList, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/alunos", label: "Alunos", icon: Users },
  { href: "/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/avaliacoes", label: "Avaliações", icon: ClipboardList },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    window.location.href = "/login"
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[230px] bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 shadow-sm",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Close button mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white shadow-md lg:hidden"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Logo and user info */}
        <div className="px-6 py-8 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-900 ring-1 ring-slate-200">
              <Image
                src="/logo.jpg"
                alt="Marcelo Personal Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-base">Marcelo</h2>
              <p className="text-sm text-slate-500">Personal Trainer</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 transition duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  )
}
