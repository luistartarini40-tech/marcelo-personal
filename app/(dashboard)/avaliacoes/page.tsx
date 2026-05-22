"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, Plus, ClipboardList, TrendingUp, Eye } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function AvaliacoesPage() {
  const { avaliacoes } = useData()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAvaliacoes = avaliacoes.filter((avaliacao) =>
    avaliacao.alunoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sorted = useMemo(
    () =>
      [...filteredAvaliacoes].sort(
        (a, b) =>
          new Date(b.dataAvaliacao).getTime() -
          new Date(a.dataAvaliacao).getTime()
      ),
    [filteredAvaliacoes]
  )

  const alunosComAvaliacao = useMemo(() => {
    const map = new Map<string, { nome: string; count: number; ultima: string }>()
    for (const a of avaliacoes) {
      const prev = map.get(a.alunoId)
      if (!prev) {
        map.set(a.alunoId, {
          nome: a.alunoNome,
          count: 1,
          ultima: a.dataAvaliacao,
        })
      } else {
        prev.count += 1
        if (new Date(a.dataAvaliacao) > new Date(prev.ultima)) {
          prev.ultima = a.dataAvaliacao
        }
      }
    }
    return Array.from(map.entries())
      .map(([id, data]) => ({ id, ...data }))
      .filter((a) =>
        a.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.ultima).getTime() - new Date(a.ultima).getTime())
  }, [avaliacoes, searchTerm])

  return (
    <div className="mx-auto flex max-w-6xl flex-col space-y-6 px-2 sm:px-4 lg:px-0">
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#F1F5F9] border-[#E2E8F0]"
        />
      </div>

      {alunosComAvaliacao.length > 1 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Evolução por aluno
          </h2>
          <div className="flex flex-wrap gap-2">
            {alunosComAvaliacao.map((a) => (
              <Link key={a.id} href={`/avaliacoes/aluno/${a.id}`}>
                <Button variant="outline" size="sm" className="rounded-full">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {a.nome}
                  <span className="ml-1 text-gray-400">({a.count})</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
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
          {sorted.map((avaliacao) => (
            <Card
              key={avaliacao.id}
              className="border-[#E5E7EB] hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {avaliacao.alunoNome}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR")}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <span className="text-gray-400">Peso:</span>{" "}
                    <span className="text-gray-700">{avaliacao.medidas.peso}kg</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gordura:</span>{" "}
                    <span className="text-gray-700">{avaliacao.medidas.gordura}%</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Massa:</span>{" "}
                    <span className="text-gray-700">
                      {avaliacao.medidas.massaMagra}kg
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cintura:</span>{" "}
                    <span className="text-gray-700">
                      {avaliacao.medidas.cintura}cm
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/avaliacoes/${avaliacao.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-3 w-3 mr-1" />
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/avaliacoes/aluno/${avaliacao.alunoId}`}>
                    <Button
                      size="sm"
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Evolução
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
