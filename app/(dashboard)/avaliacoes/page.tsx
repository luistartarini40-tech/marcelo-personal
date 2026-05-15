"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Plus, ClipboardList, X } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function AvaliacoesPage() {
  const { avaliacoes, deleteAvaliacao } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAvaliacoes = avaliacoes.filter((avaliacao) =>
    avaliacao.alunoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
          <p className="text-gray-500">{avaliacoes.length} avaliações</p>
        </div>
        <Link href="/avaliacoes/nova">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Avaliação
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#F1F5F9] border-[#E2E8F0]"
        />
      </div>

      {/* Content */}
      {filteredAvaliacoes.length === 0 ? (
        <Card className="border-[#E5E7EB]">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-gray-100 rounded-full mb-3">
              <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAvaliacoes.map((avaliacao) => (
            <Card key={avaliacao.id} className="border-[#E5E7EB]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAvaliacao(avaliacao.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {avaliacao.alunoNome}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR")}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Peso:</span>{" "}
                    <span className="text-gray-700">{avaliacao.medidas.peso}kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Altura:</span>{" "}
                    <span className="text-gray-700">{avaliacao.medidas.altura}cm</span>
                  </div>
                  <div>
                    <span className="text-gray-400">% Gordura:</span>{" "}
                    <span className="text-gray-700">{avaliacao.medidas.gordura}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Massa Magra:</span>{" "}
                    <span className="text-gray-700">{avaliacao.medidas.massaMagra}kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
