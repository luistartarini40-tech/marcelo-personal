"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  medidasLabels,
  medidasUnits,
  deltaTone,
  formatDelta,
  sortAvaliacoesByDate,
} from "@/lib/avaliacao-utils"
import type { Avaliacao } from "@/lib/types"

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function AvaliacaoAlunoPage() {
  const { alunoId } = useParams() as { alunoId: string }
  const { alunos, avaliacoes } = useData()

  const aluno = alunos.find((a) => a.id === alunoId)
  const historico = useMemo(
    () => sortAvaliacoesByDate(avaliacoes.filter((a) => a.alunoId === alunoId)),
    [avaliacoes, alunoId]
  )

  const [baseId, setBaseId] = useState("")
  const [atualId, setAtualId] = useState("")

  const base = historico.find((a) => a.id === baseId)
  const atual = historico.find((a) => a.id === atualId)

  if (!aluno) {
    return (
      <div className="text-center py-12 text-gray-500">Aluno não encontrado</div>
    )
  }

  if (historico.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <Link href="/avaliacoes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <p className="text-gray-500">Nenhuma avaliação para {aluno.nome}.</p>
        <Link href="/avaliacoes/nova">
          <Button className="bg-[#2563EB] text-white">Nova Avaliação</Button>
        </Link>
      </div>
    )
  }

  const defaultBase = historico[historico.length - 1]?.id ?? ""
  const defaultAtual = historico[0]?.id ?? ""
  const baseEval = base ?? historico.find((a) => a.id === defaultBase)
  const atualEval = atual ?? historico.find((a) => a.id === defaultAtual)

  const comparacao = useMemo(() => {
    if (!baseEval || !atualEval || baseEval.id === atualEval.id) return null
    const keys = Object.keys(medidasLabels) as (keyof Avaliacao["medidas"])[]
    return keys.map((key) => {
      const antes = baseEval.medidas[key] ?? 0
      const depois = atualEval.medidas[key] ?? 0
      const delta = depois - antes
      return { key, label: medidasLabels[key], unit: medidasUnits[key], antes, depois, delta }
    })
  }, [baseEval, atualEval])

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-2 sm:px-4 lg:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/avaliacoes">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{aluno.nome}</h1>
            <p className="text-gray-500">{historico.length} avaliações registradas</p>
          </div>
        </div>
        <Link href="/avaliacoes/nova">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
            Nova Avaliação
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="comparar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="comparar">Comparar evolução</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="comparar" className="mt-6 space-y-6">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-lg">Selecione as avaliações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Avaliação anterior (base)</p>
                <Select
                  value={baseId || defaultBase}
                  onValueChange={setBaseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {historico.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {formatDate(a.dataAvaliacao)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Avaliação atual</p>
                <Select
                  value={atualId || defaultAtual}
                  onValueChange={setAtualId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {historico.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {formatDate(a.dataAvaliacao)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {comparacao && baseEval && atualEval ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {comparacao.slice(0, 4).map((item) => {
                  const tone = deltaTone(item.key, item.delta)
                  return (
                    <Card key={item.key} className="border-[#E5E7EB]">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="text-2xl font-bold mt-1">
                          {item.depois}
                          {item.unit ? ` ${item.unit}` : ""}
                        </p>
                        <p
                          className={cn(
                            "text-sm mt-2 flex items-center gap-1 font-medium",
                            tone === "positive" && "text-green-600",
                            tone === "negative" && "text-red-600",
                            tone === "neutral" && "text-gray-500"
                          )}
                        >
                          {tone === "positive" && (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          {tone === "negative" && (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {tone === "neutral" && <Minus className="h-4 w-4" />}
                          {formatDelta(item.delta, item.unit)}
                          <span className="text-gray-400 font-normal">
                            vs {formatDate(baseEval.dataAvaliacao)}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle className="text-lg">Todas as medidas</CardTitle>
                  <p className="text-sm text-gray-500">
                    {formatDate(baseEval.dataAvaliacao)} →{" "}
                    {formatDate(atualEval.dataAvaliacao)}
                  </p>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-gray-500">
                        <th className="pb-3 pr-4">Medida</th>
                        <th className="pb-3 pr-4">Antes</th>
                        <th className="pb-3 pr-4">Agora</th>
                        <th className="pb-3">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparacao.map((item) => {
                        const tone = deltaTone(item.key, item.delta)
                        return (
                          <tr key={item.key} className="border-b border-gray-50">
                            <td className="py-3 pr-4 font-medium">{item.label}</td>
                            <td className="py-3 pr-4 text-gray-600">
                              {item.antes}
                              {item.unit ? ` ${item.unit}` : ""}
                            </td>
                            <td className="py-3 pr-4">{item.depois}{item.unit ? ` ${item.unit}` : ""}</td>
                            <td
                              className={cn(
                                "py-3 font-medium",
                                tone === "positive" && "text-green-600",
                                tone === "negative" && "text-red-600",
                                tone === "neutral" && "text-gray-500"
                              )}
                            >
                              {formatDelta(item.delta, item.unit)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB]">
                <CardHeader>
                  <CardTitle className="text-lg">Fotos — antes e depois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {(["frente", "lateral", "costas"] as const).map((pos) => (
                      <div key={pos}>
                        <p className="text-sm font-medium text-gray-600 mb-2 capitalize">
                          {pos}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <PhotoSlot
                            src={baseEval.fotos[pos]}
                            label={formatDate(baseEval.dataAvaliacao)}
                          />
                          <PhotoSlot
                            src={atualEval.fotos[pos]}
                            label={formatDate(atualEval.dataAvaliacao)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Selecione duas avaliações diferentes para comparar.
            </p>
          )}
        </TabsContent>

        <TabsContent value="historico" className="mt-6">
          <div className="space-y-3">
            {historico.map((a) => (
              <Link key={a.id} href={`/avaliacoes/${a.id}`}>
                <Card className="border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {formatDate(a.dataAvaliacao)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Peso: {a.medidas.peso}kg · Gordura: {a.medidas.gordura}% ·
                        Massa magra: {a.medidas.massaMagra}kg
                      </p>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      Ver detalhes →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PhotoSlot({ src, label }: { src: string | null; label: string }) {
  return (
    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
      {src ? (
        <Image src={src} alt={label} fill className="object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full text-xs text-gray-400">
          Sem foto
        </div>
      )}
      <span className="absolute bottom-1 left-1 right-1 text-center text-[10px] bg-black/50 text-white rounded px-1 py-0.5 truncate">
        {label}
      </span>
    </div>
  )
}
