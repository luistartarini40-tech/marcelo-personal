"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Edit, Trash } from "lucide-react"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FichaExerciciosForm,
  emptyExercicio,
  type ExercicioFormItem,
} from "@/components/ficha-exercicios-form"
import { printFichaPdf } from "@/lib/pdf"

export default function FichaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { treinoId, fichaId } = params as { treinoId: string; fichaId: string }
  const { treinos, fichas, updateFicha, deleteFicha, loading } = useData()

  const treino = treinos.find((t) => t.id === treinoId)
  const ficha = fichas.find((f) => f.id === fichaId)

  const [openEdit, setOpenEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    nome: "",
    dias: "",
    exercicios: [] as ExercicioFormItem[],
  })

  const openEditDialog = () => {
    if (!ficha) return
    setEditForm({
      nome: ficha.nome,
      dias: ficha.diasDaSemana,
      exercicios:
        ficha.exercicios.length > 0
          ? ficha.exercicios.map((e) => ({
              ...e,
              id: e.id || crypto.randomUUID(),
            }))
          : [emptyExercicio()],
    })
    setOpenEdit(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ficha) return
    setSaving(true)
    try {
      await updateFicha(ficha.id, {
        nome: editForm.nome,
        diasDaSemana: editForm.dias,
        exercicios: editForm.exercicios,
      })
      setOpenEdit(false)
    } catch {
      alert("Não foi possível salvar a ficha.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!ficha || !confirm("Excluir esta ficha?")) return
    try {
      await deleteFicha(ficha.id)
      router.push(`/treinos/${treinoId}`)
    } catch {
      alert("Não foi possível excluir a ficha.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Carregando ficha...
      </div>
    )
  }

  if (!ficha) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Ficha não encontrada</p>
        <Link href={`/treinos/${treinoId}`}>
          <Button variant="outline">Voltar ao programa</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/treinos/${treinoId}`}>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ficha.nome}</h1>
            {treino && (
              <p className="text-sm text-gray-500 mt-1">
                {treino.nome} · {treino.alunoNome}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => printFichaPdf(ficha, treino)}>
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button variant="outline" onClick={openEditDialog}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <Card className="border-[#E5E7EB]">
        <CardContent className="p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Dias da semana</p>
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-gray-900">
            {ficha.diasDaSemana || "—"}
          </p>

          <h2 className="text-lg font-semibold mt-6 mb-4">Exercícios</h2>
          {ficha.exercicios.length === 0 ? (
            <p className="text-gray-400 italic">Nenhum exercício cadastrado.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 font-medium">Exercício</th>
                    <th className="text-left p-3 font-medium">Séries</th>
                    <th className="text-left p-3 font-medium">Reps</th>
                    <th className="text-left p-3 font-medium">Carga</th>
                    <th className="text-left p-3 font-medium">Descanso</th>
                  </tr>
                </thead>
                <tbody>
                  {ficha.exercicios.map((ex) => (
                    <tr key={ex.id} className="border-t border-gray-100">
                      <td className="p-3 font-medium">{ex.nome}</td>
                      <td className="p-3 text-gray-600">{ex.series || "—"}</td>
                      <td className="p-3 text-gray-600">{ex.reps || "—"}</td>
                      <td className="p-3 text-gray-600">{ex.carga || "—"}</td>
                      <td className="p-3 text-gray-600">{ex.descanso || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ficha</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Ficha *</Label>
                <Input
                  id="nome"
                  required
                  value={editForm.nome}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, nome: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dias">Dias da Semana</Label>
                <Input
                  id="dias"
                  placeholder="Ex: Segunda e Quinta"
                  value={editForm.dias}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, dias: e.target.value }))
                  }
                />
              </div>
            </div>
            <FichaExerciciosForm
              exercicios={editForm.exercicios}
              onChange={(exercicios) =>
                setEditForm((p) => ({ ...p, exercicios }))
              }
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEdit(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#2563EB] text-white"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar Ficha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
