"use client"

import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useData } from "@/lib/data-context"
import { ArrowLeft, Plus, FileText, Edit, Trash, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import {
  FichaExerciciosForm,
  emptyExercicio,
  type ExercicioFormItem,
} from "@/components/ficha-exercicios-form"
import { printFichaPdf, printProgramaPdf } from "@/lib/pdf"

export default function TreinoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { treinoId } = params as { treinoId: string }
  const { treinos, fichas, addFicha, updateTreino, deleteTreino, updateFicha, deleteFicha, alunos, loading } = useData()

  const treino = treinos.find((t) => t.id === treinoId)

  const [openNovaFicha, setOpenNovaFicha] = useState(false)
  const [openEditPrograma, setOpenEditPrograma] = useState(false)
  const [openEditFicha, setOpenEditFicha] = useState(false)
  const [activeFichaId, setActiveFichaId] = useState<string | null>(null)

  // form state for nova ficha
  const [saving, setSaving] = useState(false)
  const [fichaForm, setFichaForm] = useState({
    nome: "",
    dias: "",
    exercicios: [emptyExercicio()] as ExercicioFormItem[],
  })

  const [editingFicha, setEditingFicha] = useState<{ id: string } | null>(null)
  const [editFichaForm, setEditFichaForm] = useState({
    nome: "",
    dias: "",
    exercicios: [] as ExercicioFormItem[],
  })

  // form state for edit programa
  const [programForm, setProgramForm] = useState({
    nome: treino?.nome || "",
    alunoId: treino?.alunoId || "",
    dataInicio: treino?.dataInicio || "",
    dataTermino: treino?.dataTermino || "",
    objetivo: treino?.objetivo || "",
    observacoes: treino?.observacoes || "",
  })

  useEffect(() => {
    if (treino) {
      setProgramForm({
        nome: treino.nome,
        alunoId: treino.alunoId,
        dataInicio: treino.dataInicio,
        dataTermino: treino.dataTermino,
        objetivo: treino.objetivo,
        observacoes: treino.observacoes,
      })
    }
  }, [treino])

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500">
        Carregando programa...
      </div>
    )
  }

  if (!treino) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-gray-600">Treino não encontrado</p>
        <Link href="/treinos">
          <Button variant="outline">Voltar para Treinos</Button>
        </Link>
      </div>
    )
  }

  const fichasDoTreino = fichas.filter((f) => f.treinoId === treino.id)

  return (
    <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-0">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/treinos">
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <ArrowLeft className="h-5 w-5 text-slate-500" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-semibold text-slate-950">{treino.nome}</h1>
              <p className="text-sm text-slate-500 mt-1">{treino.alunoNome}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="transition transform hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => printProgramaPdf(treino, fichasDoTreino)}
            >
              <FileText className="h-4 w-4 mr-2" /> PDF Programa
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="transition transform hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => setOpenEditPrograma(true)}
            >
              <Edit className="h-4 w-4" /> Editar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 border border-red-100 hover:bg-red-50 transition-transform hover:-translate-y-0.5"
              onClick={async () => {
                if (confirm("Excluir programa?")) {
                  try {
                    await deleteTreino(treino.id)
                    router.push("/treinos")
                  } catch {
                    alert("Não foi possível excluir.")
                  }
                }
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Dialog open={openEditPrograma} onOpenChange={setOpenEditPrograma}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Programa</DialogTitle>
            </DialogHeader>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const aluno = alunos.find((a) => a.id === programForm.alunoId)
              setSaving(true)
              try {
                await updateTreino(treino.id, {
                  ...programForm,
                  alunoNome: aluno ? aluno.nome : treino.alunoNome,
                })
                setOpenEditPrograma(false)
              } catch {
                alert("Não foi possível salvar o programa.")
              } finally {
                setSaving(false)
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="progNome">Nome do Programa *</Label>
                <Input id="progNome" required value={programForm.nome} onChange={(e) => setProgramForm((p) => ({ ...p, nome: e.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alunoSelect">Aluno *</Label>
                <select id="alunoSelect" className="w-full rounded-md border p-2" value={programForm.alunoId} onChange={(e) => setProgramForm((p) => ({ ...p, alunoId: e.target.value }))}>
                  {alunos.map((a) => (
                    <option key={a.id} value={a.id}>{a.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input id="dataInicio" type="date" value={programForm.dataInicio} onChange={(e) => setProgramForm((p) => ({ ...p, dataInicio: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataTermino">Data de Término</Label>
                  <Input id="dataTermino" type="date" value={programForm.dataTermino} onChange={(e) => setProgramForm((p) => ({ ...p, dataTermino: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="objetivo">Objetivo do Programa</Label>
                <Input id="objetivo" value={programForm.objetivo} onChange={(e) => setProgramForm((p) => ({ ...p, objetivo: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Input id="observacoes" value={programForm.observacoes} onChange={(e) => setProgramForm((p) => ({ ...p, observacoes: e.target.value }))} />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenEditPrograma(false)}>Cancelar</Button>
                <Button type="submit" className="bg-[#2563EB] text-white" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar Programa"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Objetivo</p>
          <p className="mt-4 rounded-3xl bg-slate-50 px-5 py-5 text-lg font-semibold text-slate-950">
            {treino.objetivo || '—'}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Fichas de Treino ({fichasDoTreino.length})</h2>
        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={() => setOpenNovaFicha(true)}>
          <Plus className="h-4 w-4 mr-2" /> Nova Ficha
        </Button>
      </div>

      <Dialog open={openNovaFicha} onOpenChange={setOpenNovaFicha}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Ficha de Treino</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault()
            setSaving(true)
            try {
              await addFicha({
                treinoId: treino.id,
                nome: fichaForm.nome,
                diasDaSemana: fichaForm.dias,
                exercicios: fichaForm.exercicios,
              })
              setOpenNovaFicha(false)
              setFichaForm({ nome: "", dias: "", exercicios: [emptyExercicio()] })
            } catch {
              alert("Não foi possível salvar a ficha.")
            } finally {
              setSaving(false)
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeFicha">Nome da Ficha *</Label>
                <Input id="nomeFicha" required value={fichaForm.nome} onChange={(e) => setFichaForm((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: Ficha A - Peito e Tríceps" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dias">Dias da Semana</Label>
                <Input id="dias" value={fichaForm.dias} onChange={(e) => setFichaForm((p) => ({ ...p, dias: e.target.value }))} placeholder="Ex: Segunda e Quinta" />
              </div>
            </div>
            <FichaExerciciosForm
              exercicios={fichaForm.exercicios}
              onChange={(exercicios) => setFichaForm((p) => ({ ...p, exercicios }))}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNovaFicha(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#2563EB] text-white" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Ficha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {fichasDoTreino.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="py-12 text-center text-gray-500">
            Nenhuma ficha criada ainda.
            <div className="mt-2">
              <button onClick={() => setOpenNovaFicha(true)} className="text-blue-600">Criar primeira ficha</button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {fichasDoTreino.map((f) => (
            <Card
              key={f.id}
              className="border-[#E5E7EB] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              onMouseEnter={() => setActiveFichaId(f.id)}
              onMouseLeave={() => setActiveFichaId(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/treinos/${treino.id}/fichas/${f.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {f.nome}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{f.diasDaSemana || '—'}</p>
                    <div className="mt-4 text-sm text-gray-600">
                      {f.exercicios.length === 0 ? (
                        <p className="italic text-gray-400">Nenhum exercício adicionado.</p>
                      ) : (
                        <ul className="space-y-1">
                          {f.exercicios.map((ex) => (
                            <li key={ex.id} className="rounded-lg bg-[#F8FAFC] p-2">
                              <span className="font-medium">{ex.nome}</span>
                              <span className="text-xs text-gray-500 ml-2">{ex.series ? `${ex.series} séries` : ''}{ex.reps ? ` • ${ex.reps} reps` : ''}{ex.carga ? ` • ${ex.carga}` : ''}{ex.descanso ? ` • ${ex.descanso}` : ''}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:bg-slate-100"
                      onClick={() => printFichaPdf(f, treino)}
                      title="Baixar PDF"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:bg-slate-100"
                      onClick={() => {
                        setEditingFicha(f)
                        setEditFichaForm({
                          nome: f.nome,
                          dias: f.diasDaSemana || "",
                          exercicios:
                            f.exercicios.length > 0
                              ? f.exercicios.map((exercise) => ({
                                  ...exercise,
                                  id: exercise.id || crypto.randomUUID(),
                                }))
                              : [emptyExercicio()],
                        })
                        setOpenEditFicha(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={async () => {
                        if (confirm("Excluir ficha?")) {
                          try {
                            await deleteFicha(f.id)
                          } catch {
                            alert("Não foi possível excluir.")
                          }
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={openEditFicha} onOpenChange={setOpenEditFicha}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ficha</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault()
            if (!editingFicha) return
            setSaving(true)
            try {
              await updateFicha(editingFicha.id, {
                nome: editFichaForm.nome,
                diasDaSemana: editFichaForm.dias,
                exercicios: editFichaForm.exercicios,
              })
              setOpenEditFicha(false)
            } catch {
              alert("Não foi possível salvar a ficha.")
            } finally {
              setSaving(false)
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editNomeFicha">Nome da Ficha *</Label>
                <Input id="editNomeFicha" autoFocus required placeholder="Ex: Ficha 1" value={editFichaForm.nome} onChange={(e) => setEditFichaForm((p) => ({ ...p, nome: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDias">Dias da Semana</Label>
                <Input id="editDias" placeholder="Ex: Segunda e Quinta" value={editFichaForm.dias} onChange={(e) => setEditFichaForm((p) => ({ ...p, dias: e.target.value }))} />
              </div>
            </div>
            <FichaExerciciosForm
              exercicios={editFichaForm.exercicios}
              onChange={(exercicios) =>
                setEditFichaForm((p) => ({ ...p, exercicios }))
              }
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEditFicha(false)}>Cancelar</Button>
              <Button type="submit" className="bg-[#2563EB] text-white" disabled={saving}>
                {saving ? "Salvando..." : "Salvar Ficha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
