"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Aluno, Treino, Avaliacao, Usuario } from "./types"

interface DataContextType {
  usuario: Usuario
  alunos: Aluno[]
  treinos: Treino[]
  avaliacoes: Avaliacao[]
  addAluno: (aluno: Omit<Aluno, "id" | "criadoEm">) => void
  updateAluno: (id: string, aluno: Partial<Aluno>) => void
  deleteAluno: (id: string) => void
  addTreino: (treino: Omit<Treino, "id" | "criadoEm">) => void
  updateTreino: (id: string, treino: Partial<Treino>) => void
  deleteTreino: (id: string) => void
  addAvaliacao: (avaliacao: Omit<Avaliacao, "id" | "criadoEm">) => void
  updateAvaliacao: (id: string, avaliacao: Partial<Avaliacao>) => void
  deleteAvaliacao: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])

  const usuario: Usuario = {
    nome: "Marcelo",
    cargo: "Personal Trainer",
    iniciais: "MP",
  }

  useEffect(() => {
    const storedAlunos = localStorage.getItem("alunos")
    const storedTreinos = localStorage.getItem("treinos")
    const storedAvaliacoes = localStorage.getItem("avaliacoes")

    if (storedAlunos) setAlunos(JSON.parse(storedAlunos))
    if (storedTreinos) setTreinos(JSON.parse(storedTreinos))
    if (storedAvaliacoes) setAvaliacoes(JSON.parse(storedAvaliacoes))
  }, [])

  useEffect(() => {
    localStorage.setItem("alunos", JSON.stringify(alunos))
  }, [alunos])

  useEffect(() => {
    localStorage.setItem("treinos", JSON.stringify(treinos))
  }, [treinos])

  useEffect(() => {
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes))
  }, [avaliacoes])

  const addAluno = (aluno: Omit<Aluno, "id" | "criadoEm">) => {
    const newAluno: Aluno = {
      ...aluno,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    }
    setAlunos((prev) => [...prev, newAluno])
  }

  const updateAluno = (id: string, aluno: Partial<Aluno>) => {
    setAlunos((prev) => prev.map((a) => (a.id === id ? { ...a, ...aluno } : a)))
  }

  const deleteAluno = (id: string) => {
    setAlunos((prev) => prev.filter((a) => a.id !== id))
  }

  const addTreino = (treino: Omit<Treino, "id" | "criadoEm">) => {
    const newTreino: Treino = {
      ...treino,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    }
    setTreinos((prev) => [...prev, newTreino])
  }

  const updateTreino = (id: string, treino: Partial<Treino>) => {
    setTreinos((prev) => prev.map((t) => (t.id === id ? { ...t, ...treino } : t)))
  }

  const deleteTreino = (id: string) => {
    setTreinos((prev) => prev.filter((t) => t.id !== id))
  }

  const addAvaliacao = (avaliacao: Omit<Avaliacao, "id" | "criadoEm">) => {
    const newAvaliacao: Avaliacao = {
      ...avaliacao,
      id: crypto.randomUUID(),
      criadoEm: new Date().toISOString(),
    }
    setAvaliacoes((prev) => [...prev, newAvaliacao])
  }

  const updateAvaliacao = (id: string, avaliacao: Partial<Avaliacao>) => {
    setAvaliacoes((prev) => prev.map((a) => (a.id === id ? { ...a, ...avaliacao } : a)))
  }

  const deleteAvaliacao = (id: string) => {
    setAvaliacoes((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        usuario,
        alunos,
        treinos,
        avaliacoes,
        addAluno,
        updateAluno,
        deleteAluno,
        addTreino,
        updateTreino,
        deleteTreino,
        addAvaliacao,
        updateAvaliacao,
        deleteAvaliacao,
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
