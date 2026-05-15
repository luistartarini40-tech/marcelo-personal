"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X } from "lucide-react"
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

const medidasFields = [
  { key: "peso", label: "Peso", unit: "kg" },
  { key: "altura", label: "Altura", unit: "cm" },
  { key: "gordura", label: "% Gordura", unit: "%" },
  { key: "massaMagra", label: "Massa Magra", unit: "kg" },
  { key: "cintura", label: "Cintura", unit: "cm" },
  { key: "quadril", label: "Quadril", unit: "cm" },
  { key: "peitoral", label: "Peitoral", unit: "cm" },
  { key: "abdomen", label: "Abdômen", unit: "cm" },
  { key: "bracoDireito", label: "Braço Direito", unit: "cm" },
  { key: "bracoEsquerdo", label: "Braço Esquerdo", unit: "cm" },
  { key: "coxaDireita", label: "Coxa Direita", unit: "cm" },
  { key: "coxaEsquerda", label: "Coxa Esquerda", unit: "cm" },
  { key: "panturrilhaDireita", label: "Panturrilha Dir.", unit: "cm" },
  { key: "panturrilhaEsquerda", label: "Panturrilha Esq.", unit: "cm" },
]

export default function NovaAvaliacaoPage() {
  const router = useRouter()
  const { alunos, addAvaliacao } = useData()
  const [alunoId, setAlunoId] = useState("")
  const [dataAvaliacao, setDataAvaliacao] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [medidas, setMedidas] = useState<Record<string, number>>({
    peso: 0,
    altura: 0,
    gordura: 0,
    massaMagra: 0,
    cintura: 0,
    quadril: 0,
    peitoral: 0,
    abdomen: 0,
    bracoDireito: 0,
    bracoEsquerdo: 0,
    coxaDireita: 0,
    coxaEsquerda: 0,
    panturrilhaDireita: 0,
    panturrilhaEsquerda: 0,
  })
  const [observacoes, setObservacoes] = useState("")
  const [fotos, setFotos] = useState<{
    frente: string | null
    lateral: string | null
    costas: string | null
  }>({
    frente: null,
    lateral: null,
    costas: null,
  })

  const frenteInputRef = useRef<HTMLInputElement>(null)
  const lateralInputRef = useRef<HTMLInputElement>(null)
  const costasInputRef = useRef<HTMLInputElement>(null)

  const inputRefs = {
    frente: frenteInputRef,
    lateral: lateralInputRef,
    costas: costasInputRef,
  }

  const handleFileChange = (
    key: "frente" | "lateral" | "costas",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFotos((prev) => ({
          ...prev,
          [key]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (key: "frente" | "lateral" | "costas") => {
    setFotos((prev) => ({
      ...prev,
      [key]: null,
    }))
    const inputRef = inputRefs[key]
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const aluno = alunos.find((a) => a.id === alunoId)
    if (!aluno) return

    addAvaliacao({
      alunoId,
      alunoNome: aluno.nome,
      dataAvaliacao,
      medidas: medidas as typeof medidas & {
        peso: number
        altura: number
        gordura: number
        massaMagra: number
        cintura: number
        quadril: number
        peitoral: number
        abdomen: number
        bracoDireito: number
        bracoEsquerdo: number
        coxaDireita: number
        coxaEsquerda: number
        panturrilhaDireita: number
        panturrilhaEsquerda: number
      },
      fotos: {
        frente: fotos.frente,
        lateral: fotos.lateral,
        costas: fotos.costas,
      },
      observacoes,
    })
    router.push("/avaliacoes")
  }

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/avaliacoes">
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nova Avaliação</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Card */}
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aluno">Aluno *</Label>
                <Select value={alunoId} onValueChange={setAlunoId} required>
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
              <div className="space-y-2">
                <Label htmlFor="data">Data da Avaliação *</Label>
                <Input
                  id="data"
                  type="date"
                  value={dataAvaliacao}
                  onChange={(e) => setDataAvaliacao(e.target.value)}
                  className="bg-[#F1F5F9] border-[#E2E8F0]"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medidas Card */}
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg">Medidas Corporais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {medidasFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key} className="text-sm">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.key}
                      type="number"
                      value={medidas[field.key]}
                      onChange={(e) =>
                        setMedidas({
                          ...medidas,
                          [field.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-[#F1F5F9] border-[#E2E8F0] pr-10"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      {field.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fotos Card */}
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
                <div key={key} className="relative">
                  <input
                    type="file"
                    ref={inputRefs[key]}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(key, e)}
                  />
                  {fotos[key] ? (
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={fotos[key]!}
                        alt={label}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(key)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {label}
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={() => inputRefs[key].current?.click()}
                      className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Clique para enviar
                      </span>
                      <span className="text-xs text-gray-400 mt-1">{label}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observações Card */}
        <Card className="border-[#E5E7EB]">
          <CardHeader>
            <CardTitle className="text-lg">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Anotações sobre a avaliação..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="bg-[#F1F5F9] border-[#E2E8F0] min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/avaliacoes">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          >
            Salvar Avaliação
          </Button>
        </div>
      </form>
    </div>
  )
}
