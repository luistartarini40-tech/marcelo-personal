"use client"

import Link from "next/link"
import { Users, ClipboardList, TrendingUp, UserPlus } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { alunos, treinos, avaliacoes } = useData()

  const alunosRecentes = alunos.slice(-5).reverse()

  const metricas = [
    {
      label: "Alunos Ativos",
      value: alunos.length,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Avaliações",
      value: avaliacoes.length,
      icon: ClipboardList,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Programas Ativos",
      value: treinos.length,
      icon: TrendingUp,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Total de Alunos",
      value: alunos.length,
      icon: TrendingUp,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo! 👋</h1>
        <p className="text-gray-500 mt-1">Aqui está o resumo dos seus alunos.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricas.map((metrica) => {
          const Icon = metrica.icon
          return (
            <Card key={metrica.label} className="border-[#E5E7EB]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${metrica.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metrica.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{metrica.value}</p>
                    <p className="text-sm text-gray-500">{metrica.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Students */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Alunos Recentes</h2>
          <Link
            href="/alunos"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos
          </Link>
        </div>

        {alunosRecentes.length === 0 ? (
          <Card className="border-[#E5E7EB]">
            <CardContent className="py-12 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-gray-100 rounded-full mb-3">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Nenhum aluno cadastrado ainda.</p>
              <Link
                href="/alunos"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                Adicionar primeiro aluno
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#E5E7EB]">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {alunosRecentes.map((aluno) => (
                  <div
                    key={aluno.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-medium">
                        {aluno.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{aluno.nome}</p>
                        <p className="text-sm text-gray-500">{aluno.email}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{aluno.objetivo}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
