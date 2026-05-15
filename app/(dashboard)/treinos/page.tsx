"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, Dumbbell, X } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function TreinosPage() {
  const { treinos, deleteTreino } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTreinos = treinos.filter(
    (treino) =>
      treino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treino.alunoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
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
            <Card key={treino.id} className="border-[#E5E7EB]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Dumbbell className="h-5 w-5 text-orange-600" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTreino(treino.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{treino.nome}</h3>
                <p className="text-sm text-gray-500 mb-2">{treino.alunoNome}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>
                    {new Date(treino.dataInicio).toLocaleDateString("pt-BR")}
                  </span>
                  <span>-</span>
                  <span>
                    {new Date(treino.dataTermino).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                {treino.objetivo && (
                  <p className="text-sm text-gray-500 mt-2">{treino.objetivo}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
