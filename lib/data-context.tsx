"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { Aluno, Treino, Avaliacao, Usuario, Ficha } from "./types"
import { createClient } from "@/lib/supabase/client"
import {
  dbToAluno,
  dbToTreino,
  dbToFicha,
  dbToAvaliacao,
  alunoToDb,
  alunoPartialToDb,
  treinoToDb,
  treinoPartialToDb,
  fichaToDb,
  fichaPartialToDb,
  avaliacaoToDb,
  avaliacaoPartialToDb,
  type DbAluno,
  type DbTreino,
  type DbFicha,
  type DbAvaliacao,
} from "@/lib/supabase/mappers"

interface DataContextType {
  usuario: Usuario
  alunos: Aluno[]
  treinos: Treino[]
  fichas: Ficha[]
  avaliacoes: Avaliacao[]
  loading: boolean
  error: string | null
  addAluno: (aluno: Omit<Aluno, "id" | "criadoEm">) => Promise<void>
  updateAluno: (id: string, aluno: Partial<Aluno>) => Promise<void>
  deleteAluno: (id: string) => Promise<void>
  addTreino: (treino: Omit<Treino, "id" | "criadoEm">) => Promise<string>
  updateTreino: (id: string, treino: Partial<Treino>) => Promise<void>
  deleteTreino: (id: string) => Promise<void>
  addFicha: (ficha: Omit<Ficha, "id" | "criadoEm">) => Promise<void>
  updateFicha: (id: string, ficha: Partial<Ficha>) => Promise<void>
  deleteFicha: (id: string) => Promise<void>
  addAvaliacao: (avaliacao: Omit<Avaliacao, "id" | "criadoEm">) => Promise<void>
  updateAvaliacao: (id: string, avaliacao: Partial<Avaliacao>) => Promise<void>
  deleteAvaliacao: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

async function getUserId(): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) throw new Error("Usuário não autenticado")
  return user.id
}

function buildUsuario(user: {
  user_metadata?: Record<string, unknown>
  email?: string | null
}): Usuario {
  const nome =
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "Personal"
  return {
    nome,
    cargo: "Personal Trainer",
    iniciais: nome.charAt(0).toUpperCase(),
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [fichas, setFichas] = useState<Ficha[]>([])
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])
  const [usuario, setUsuario] = useState<Usuario>({
    nome: "Personal",
    cargo: "Personal Trainer",
    iniciais: "P",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const migrateFromLocalStorage = useCallback(async (userId: string) => {
    const supabase = createClient()
    const keys = ["alunos", "treinos", "fichas", "avaliacoes"] as const
    const hasLocal = keys.some((k) => localStorage.getItem(k))
    if (!hasLocal) return

    const storedAlunos: Aluno[] = JSON.parse(localStorage.getItem("alunos") || "[]")
    const storedTreinos: Treino[] = JSON.parse(localStorage.getItem("treinos") || "[]")
    const storedFichas: Ficha[] = JSON.parse(localStorage.getItem("fichas") || "[]")
    const storedAvaliacoes: Avaliacao[] = JSON.parse(
      localStorage.getItem("avaliacoes") || "[]"
    )

    if (storedAlunos.length > 0) {
      await supabase.from("alunos").insert(
        storedAlunos.map((a) => ({
          id: a.id,
          ...alunoToDb(a, userId),
          criado_em: a.criadoEm,
        }))
      )
    }
    if (storedTreinos.length > 0) {
      await supabase.from("treinos").insert(
        storedTreinos.map((t) => ({
          id: t.id,
          ...treinoToDb(t, userId),
          criado_em: t.criadoEm,
        }))
      )
    }
    if (storedFichas.length > 0) {
      await supabase.from("fichas").insert(
        storedFichas.map((f) => ({
          id: f.id,
          ...fichaToDb(f, userId),
          criado_em: f.criadoEm,
        }))
      )
    }
    if (storedAvaliacoes.length > 0) {
      await supabase.from("avaliacoes").insert(
        storedAvaliacoes.map((a) => ({
          id: a.id,
          ...avaliacaoToDb(a, userId),
          criado_em: a.criadoEm,
        }))
      )
    }

    keys.forEach((k) => localStorage.removeItem(k))
  }, [])

  const fetchAll = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) throw new Error("Usuário não autenticado")

      setUsuario(buildUsuario(user))

      const [alunosRes, treinosRes, fichasRes, avaliacoesRes] = await Promise.all([
        supabase.from("alunos").select("*").order("criado_em", { ascending: true }),
        supabase.from("treinos").select("*").order("criado_em", { ascending: true }),
        supabase.from("fichas").select("*").order("criado_em", { ascending: true }),
        supabase.from("avaliacoes").select("*").order("criado_em", { ascending: true }),
      ])

      const tableMissing = (err: { code?: string; message?: string } | null) =>
        err?.code === "PGRST205" ||
        err?.message?.includes("Could not find the table") ||
        err?.message?.includes("schema cache")

      if (
        tableMissing(alunosRes.error) ||
        tableMissing(treinosRes.error) ||
        tableMissing(fichasRes.error) ||
        tableMissing(avaliacoesRes.error)
      ) {
        throw new Error(
          "Tabelas não encontradas. Execute supabase/schema.sql no SQL Editor do Supabase."
        )
      }

      if (alunosRes.error) throw alunosRes.error
      if (treinosRes.error) throw treinosRes.error
      if (fichasRes.error) throw fichasRes.error
      if (avaliacoesRes.error) throw avaliacoesRes.error

      const alunosData = (alunosRes.data as DbAluno[]) ?? []
      const treinosData = (treinosRes.data as DbTreino[]) ?? []
      const fichasData = (fichasRes.data as DbFicha[]) ?? []
      const avaliacoesData = (avaliacoesRes.data as DbAvaliacao[]) ?? []

      if (
        alunosData.length === 0 &&
        treinosData.length === 0 &&
        localStorage.getItem("alunos")
      ) {
        await migrateFromLocalStorage(user.id)
        return fetchAll()
      }

      setAlunos(alunosData.map(dbToAluno))
      setTreinos(treinosData.map(dbToTreino))
      setFichas(fichasData.map(dbToFicha))
      setAvaliacoes(avaliacoesData.map(dbToAvaliacao))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }, [migrateFromLocalStorage])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const addAluno = async (aluno: Omit<Aluno, "id" | "criadoEm">) => {
    const userId = await getUserId()
    const supabase = createClient()
    const { data, error } = await supabase
      .from("alunos")
      .insert(alunoToDb(aluno, userId))
      .select()
      .single()
    if (error) throw error
    setAlunos((prev) => [...prev, dbToAluno(data as DbAluno)])
  }

  const updateAluno = async (id: string, aluno: Partial<Aluno>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("alunos")
      .update(alunoPartialToDb(aluno))
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    setAlunos((prev) =>
      prev.map((a) => (a.id === id ? dbToAluno(data as DbAluno) : a))
    )
  }

  const deleteAluno = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("alunos").delete().eq("id", id)
    if (error) throw error
    setAlunos((prev) => prev.filter((a) => a.id !== id))
    setTreinos((prev) => {
      const removedTreinoIds = new Set(
        prev.filter((t) => t.alunoId === id).map((t) => t.id)
      )
      setFichas((fichas) =>
        fichas.filter((f) => !removedTreinoIds.has(f.treinoId))
      )
      return prev.filter((t) => t.alunoId !== id)
    })
    setAvaliacoes((prev) => prev.filter((a) => a.alunoId !== id))
  }

  const addTreino = async (treino: Omit<Treino, "id" | "criadoEm">) => {
    const userId = await getUserId()
    const supabase = createClient()
    const { data: treinoData, error: treinoError } = await supabase
      .from("treinos")
      .insert(treinoToDb(treino, userId))
      .select()
      .single()
    if (treinoError) throw treinoError
    const created = dbToTreino(treinoData as DbTreino)

    const { data: fichaData, error: fichaError } = await supabase
      .from("fichas")
      .insert({
        user_id: userId,
        treino_id: created.id,
        nome: `Ficha - ${created.nome}`,
        dias_da_semana: "",
        exercicios: [],
      })
      .select()
      .single()
    if (fichaError) throw fichaError

    setTreinos((prev) => [...prev, created])
    setFichas((prev) => [...prev, dbToFicha(fichaData as DbFicha)])
    return created.id
  }

  const updateTreino = async (id: string, treino: Partial<Treino>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("treinos")
      .update(treinoPartialToDb(treino))
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    setTreinos((prev) =>
      prev.map((t) => (t.id === id ? dbToTreino(data as DbTreino) : t))
    )
  }

  const deleteTreino = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("treinos").delete().eq("id", id)
    if (error) throw error
    setTreinos((prev) => prev.filter((t) => t.id !== id))
    setFichas((prev) => prev.filter((f) => f.treinoId !== id))
  }

  const addFicha = async (ficha: Omit<Ficha, "id" | "criadoEm">) => {
    const userId = await getUserId()
    const supabase = createClient()
    const { data, error } = await supabase
      .from("fichas")
      .insert(fichaToDb(ficha, userId))
      .select()
      .single()
    if (error) throw error
    setFichas((prev) => [...prev, dbToFicha(data as DbFicha)])
  }

  const updateFicha = async (id: string, ficha: Partial<Ficha>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("fichas")
      .update(fichaPartialToDb(ficha))
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    setFichas((prev) =>
      prev.map((f) => (f.id === id ? dbToFicha(data as DbFicha) : f))
    )
  }

  const deleteFicha = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("fichas").delete().eq("id", id)
    if (error) throw error
    setFichas((prev) => prev.filter((f) => f.id !== id))
  }

  const addAvaliacao = async (avaliacao: Omit<Avaliacao, "id" | "criadoEm">) => {
    const userId = await getUserId()
    const supabase = createClient()
    const { data, error } = await supabase
      .from("avaliacoes")
      .insert(avaliacaoToDb(avaliacao, userId))
      .select()
      .single()
    if (error) throw error
    setAvaliacoes((prev) => [...prev, dbToAvaliacao(data as DbAvaliacao)])
  }

  const updateAvaliacao = async (id: string, avaliacao: Partial<Avaliacao>) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("avaliacoes")
      .update(avaliacaoPartialToDb(avaliacao))
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    setAvaliacoes((prev) =>
      prev.map((a) => (a.id === id ? dbToAvaliacao(data as DbAvaliacao) : a))
    )
  }

  const deleteAvaliacao = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("avaliacoes").delete().eq("id", id)
    if (error) throw error
    setAvaliacoes((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        usuario,
        alunos,
        treinos,
        avaliacoes,
        fichas,
        loading,
        error,
        addAluno,
        updateAluno,
        deleteAluno,
        addTreino,
        updateTreino,
        deleteTreino,
        addFicha,
        updateFicha,
        deleteFicha,
        addAvaliacao,
        updateAvaliacao,
        deleteAvaliacao,
        refresh: fetchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
