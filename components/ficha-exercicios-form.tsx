"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Exercicio } from "@/lib/types"

export type ExercicioFormItem = Exercicio & { id: string }

export function emptyExercicio(): ExercicioFormItem {
  return {
    id: crypto.randomUUID(),
    nome: "",
    series: "",
    reps: "",
    carga: "",
    descanso: "",
  }
}

interface FichaExerciciosFormProps {
  exercicios: ExercicioFormItem[]
  onChange: (exercicios: ExercicioFormItem[]) => void
}

export function FichaExerciciosForm({ exercicios, onChange }: FichaExerciciosFormProps) {
  const update = (idx: number, patch: Partial<ExercicioFormItem>) => {
    const copy = [...exercicios]
    copy[idx] = { ...copy[idx], ...patch }
    onChange(copy)
  }

  const remove = (idx: number) => {
    onChange(exercicios.filter((_, i) => i !== idx))
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-[#F8FAFC] p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <Label>Exercícios</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...exercicios, emptyExercicio()])}
        >
          + Adicionar
        </Button>
      </div>
      <p className="text-xs text-gray-400 mb-3 hidden sm:block">
        Exercício · Séries · Reps · Carga · Descanso
      </p>
      <div className="space-y-2">
        {exercicios.map((ex, idx) => (
          <div
            key={ex.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_4rem_4rem_4rem_4rem_auto] gap-2 items-center"
          >
            <Input
              placeholder="Nome do exercício"
              value={ex.nome}
              onChange={(e) => update(idx, { nome: e.target.value })}
              className="rounded-full"
            />
            <Input
              placeholder="Séries"
              value={ex.series ?? ""}
              onChange={(e) => update(idx, { series: e.target.value })}
              className="rounded-full"
            />
            <Input
              placeholder="Reps"
              value={ex.reps ?? ""}
              onChange={(e) => update(idx, { reps: e.target.value })}
              className="rounded-full"
            />
            <Input
              placeholder="Carga"
              value={ex.carga ?? ""}
              onChange={(e) => update(idx, { carga: e.target.value })}
              className="rounded-full"
            />
            <Input
              placeholder="Desc."
              value={ex.descanso ?? ""}
              onChange={(e) => update(idx, { descanso: e.target.value })}
              className="rounded-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 shrink-0"
              onClick={() => remove(idx)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
