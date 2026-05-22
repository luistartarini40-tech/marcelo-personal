"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash, TrendingUp } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { medidasLabels, medidasUnits } from "@/lib/avaliacao-utils"

export default function AvaliacaoDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { avaliacoes, deleteAvaliacao, loading } = useData()

  const avaliacao = avaliacoes.find((a) => a.id === id)

  const handleDelete = async () => {
    if (!avaliacao || !confirm("Excluir esta avaliação?")) return
    try {
      await deleteAvaliacao(avaliacao.id)
      router.push("/avaliacoes")
    } catch {
      alert("Não foi possível excluir.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Carregando...
      </div>
    )
  }

  if (!avaliacao) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Avaliação não encontrada</p>
        <Link href="/avaliacoes">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    )
  }

  const medidas = Object.entries(medidasLabels) as [
    keyof typeof medidasLabels,
    string,
  ][]

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8 px-2 sm:px-4 lg:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/avaliacoes">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {avaliacao.alunoNome}
            </h1>
            <p className="text-gray-500">
              {new Date(avaliacao.dataAvaliacao).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/avaliacoes/aluno/${avaliacao.alunoId}`}>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver evolução
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-lg">Medidas Corporais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {medidas.map(([key, label]) => (
              <div
                key={key}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-center"
              >
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {avaliacao.medidas[key]}
                  {medidasUnits[key] ? (
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {medidasUnits[key]}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-lg">Fotos de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {(
              [
                { key: "frente", label: "Frente" },
                { key: "lateral", label: "Lateral" },
                { key: "costas", label: "Costas" },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <p className="text-sm text-gray-500 mb-2">{label}</p>
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border">
                  {avaliacao.fotos[key] ? (
                    <Image
                      src={avaliacao.fotos[key]!}
                      alt={label}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                      Sem foto
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {avaliacao.observacoes ? (
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">
              {avaliacao.observacoes}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
