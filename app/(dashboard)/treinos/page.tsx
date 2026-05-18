"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Dumbbell, X, FileText, Edit } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function TreinosPage() {
  const { treinos, deleteTreino, updateTreino, fichas } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTreinos = treinos.filter(
    (treino) =>
      treino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treino.alunoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="mx-auto flex max-w-6xl flex-col space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treinos</h1>
          <p className="text-gray-500">{treinos.length} programas</p>
        </div>
        <Link href="/treinos/novo">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Programa
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar programa ou aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#F1F5F9] border-[#E2E8F0]"
        />
      </div>

      {/* Content */}
      {filteredTreinos.length === 0 ? (
        <Card className="border-[#E5E7EB]">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-gray-100 rounded-full mb-3">
              <Dumbbell className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Nenhum programa encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTreinos.map((treino) => (
            <Link
            key={treino.id}
            href={`/treinos/${treino.id}`}
            className="block group"
          >
            <Card className="border-[#E5E7EB] bg-white transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E6F0FF] flex items-center justify-center text-blue-600 font-semibold">{treino.alunoNome.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{treino.nome}</h3>
                      <p className="text-sm text-gray-500">{treino.alunoNome}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs">Ativo</span>
                </div>
              </CardContent>
            </Card>
          </Link>
          ))}
        </div>
      )}
    </div>
  )
}
