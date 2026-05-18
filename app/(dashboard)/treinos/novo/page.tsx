"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function NovoTreinoPage() {
  const router = useRouter()
  const { alunos, addTreino } = useData()
  const [formData, setFormData] = useState({
    nome: "",
    alunoId: "",
    dataInicio: "",
    dataTermino: "",
    objetivo: "",
    observacoes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const aluno = alunos.find((a) => a.id === formData.alunoId)
    if (!aluno) return

    const newId = addTreino({
      ...formData,
      alunoNome: aluno.nome,
    })
    router.push(`/treinos/${newId}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/treinos">
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Novo Programa de Treino
        </h1>
      </div>

      {/* Form */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-lg">Informações do Programa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Programa *</Label>
              <Input
                id="nome"
                placeholder="Ex: Programa Hipertrofia Abril/Maio"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
                className="bg-[#F1F5F9] border-[#E2E8F0]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aluno">Aluno *</Label>
              <Select
                value={formData.alunoId}
                onValueChange={(value) => {
                  const aluno = alunos.find((a) => a.id === value)
                  setFormData((prev) => ({
                    ...prev,
                    alunoId: value,
                    objetivo: prev.objetivo || (aluno ? aluno.objetivo : ""),
                  }))
                }}
                required
              >
                <SelectTrigger className="bg-[#F1F5F9] border-[#E2E8F0]">
                  <SelectValue placeholder="Selecionar aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno) => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, dataInicio: e.target.value })
                  }
                  className="bg-[#F1F5F9] border-[#E2E8F0]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataTermino">Data de Término</Label>
                <Input
                  id="dataTermino"
                  type="date"
                  value={formData.dataTermino}
                  onChange={(e) =>
                    setFormData({ ...formData, dataTermino: e.target.value })
                  }
                  className="bg-[#F1F5F9] border-[#E2E8F0]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo do Programa (opcional)</Label>
              <Input
                id="objetivo"
                placeholder="Ex: Ganho de massa muscular"
                value={formData.objetivo}
                onChange={(e) =>
                  setFormData({ ...formData, objetivo: e.target.value })
                }
                className="bg-[#F1F5F9] border-[#E2E8F0]"
              />
              <p className="text-sm text-gray-400">Preenchido automaticamente com o objetivo do aluno, se disponível.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Anotações sobre o programa..."
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                className="bg-[#F1F5F9] border-[#E2E8F0] min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/treinos">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                Salvar Programa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
