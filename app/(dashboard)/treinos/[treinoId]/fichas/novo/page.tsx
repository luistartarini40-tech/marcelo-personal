"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NovaFichaPage() {
  const params = useParams()
  const router = useRouter()
  const { treinoId } = params as { treinoId: string }
  const { addFicha } = useData()

  const [form, setForm] = useState({ nome: "Ficha A", dias: "", exercicios: [{ id: 1, nome: "" }] })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addFicha({
        treinoId,
        nome: form.nome,
        diasDaSemana: form.dias,
        exercicios: form.exercicios.map((ex: { nome: string }, i: number) => ({
          id: String(i + 1),
          nome: ex.nome,
        })),
      })
      router.push(`/treinos/${treinoId}`)
    } catch {
      alert("Não foi possível salvar a ficha. Tente novamente.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle>Nova Ficha de Treino</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Ficha *</Label>
                <Input id="nome" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dias">Dias da Semana</Label>
                <Input id="dias" value={form.dias} onChange={(e) => setForm((p) => ({ ...p, dias: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label>Exercícios</Label>
              {form.exercicios.map((ex: any, idx: number) => (
                <div key={idx} className="flex gap-2 mt-2">
                  <Input placeholder="Nome do exercício" value={ex.nome} onChange={(e) => { const copy = [...form.exercicios]; copy[idx].nome = e.target.value; setForm((p) => ({ ...p, exercicios: copy })); }} />
                </div>
              ))}
              <div className="mt-2">
                <Button type="button" onClick={() => setForm((p) => ({ ...p, exercicios: [...p.exercicios, { id: Date.now(), nome: "" }] }))} variant="outline">Adicionar</Button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push(`/treinos/${treinoId}`)}>Cancelar</Button>
              <Button type="submit" className="bg-[#2563EB] text-white">Salvar Ficha</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
