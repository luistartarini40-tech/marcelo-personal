"use client"

import type { ReactNode } from "react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"

export function DataLoadingGate({ children }: { children: ReactNode }) {
  const { loading, error, refresh } = useData()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-gray-500">Carregando seus dados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800 mb-2">Erro ao carregar dados</p>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={() => refresh()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
