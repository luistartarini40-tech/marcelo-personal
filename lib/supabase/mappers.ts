import type { Aluno, Treino, Ficha, Avaliacao, Exercicio } from "@/lib/types"

export type DbAluno = {
  id: string
  user_id: string
  nome: string
  email: string
  telefone: string
  data_nascimento: string
  genero: string
  objetivo: string
  observacoes: string
  criado_em: string
}

export type DbTreino = {
  id: string
  user_id: string
  nome: string
  aluno_id: string
  aluno_nome: string
  data_inicio: string
  data_termino: string
  objetivo: string
  observacoes: string
  criado_em: string
}

export type DbFicha = {
  id: string
  user_id: string
  treino_id: string
  nome: string
  dias_da_semana: string
  exercicios: Exercicio[]
  criado_em: string
}

export type DbAvaliacao = {
  id: string
  user_id: string
  aluno_id: string
  aluno_nome: string
  data_avaliacao: string
  medidas: Avaliacao["medidas"]
  fotos: Avaliacao["fotos"]
  observacoes: string
  criado_em: string
}

export function dbToAluno(row: DbAluno): Aluno {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    dataNascimento: row.data_nascimento,
    genero: row.genero,
    objetivo: row.objetivo,
    observacoes: row.observacoes,
    criadoEm: row.criado_em,
  }
}

export function alunoToDb(
  aluno: Omit<Aluno, "id" | "criadoEm">,
  userId: string
): Omit<DbAluno, "id" | "criado_em"> {
  return {
    user_id: userId,
    nome: aluno.nome,
    email: aluno.email,
    telefone: aluno.telefone,
    data_nascimento: aluno.dataNascimento,
    genero: aluno.genero,
    objetivo: aluno.objetivo,
    observacoes: aluno.observacoes,
  }
}

export function alunoPartialToDb(
  aluno: Partial<Aluno>
): Partial<Omit<DbAluno, "id" | "user_id" | "criado_em">> {
  const map: Partial<Omit<DbAluno, "id" | "user_id" | "criado_em">> = {}
  if (aluno.nome !== undefined) map.nome = aluno.nome
  if (aluno.email !== undefined) map.email = aluno.email
  if (aluno.telefone !== undefined) map.telefone = aluno.telefone
  if (aluno.dataNascimento !== undefined) map.data_nascimento = aluno.dataNascimento
  if (aluno.genero !== undefined) map.genero = aluno.genero
  if (aluno.objetivo !== undefined) map.objetivo = aluno.objetivo
  if (aluno.observacoes !== undefined) map.observacoes = aluno.observacoes
  return map
}

export function dbToTreino(row: DbTreino): Treino {
  return {
    id: row.id,
    nome: row.nome,
    alunoId: row.aluno_id,
    alunoNome: row.aluno_nome,
    dataInicio: row.data_inicio,
    dataTermino: row.data_termino,
    objetivo: row.objetivo,
    observacoes: row.observacoes,
    criadoEm: row.criado_em,
  }
}

export function treinoToDb(
  treino: Omit<Treino, "id" | "criadoEm">,
  userId: string
): Omit<DbTreino, "id" | "criado_em"> {
  return {
    user_id: userId,
    nome: treino.nome,
    aluno_id: treino.alunoId,
    aluno_nome: treino.alunoNome,
    data_inicio: treino.dataInicio,
    data_termino: treino.dataTermino,
    objetivo: treino.objetivo,
    observacoes: treino.observacoes,
  }
}

export function treinoPartialToDb(
  treino: Partial<Treino>
): Partial<Omit<DbTreino, "id" | "user_id" | "criado_em">> {
  const map: Partial<Omit<DbTreino, "id" | "user_id" | "criado_em">> = {}
  if (treino.nome !== undefined) map.nome = treino.nome
  if (treino.alunoId !== undefined) map.aluno_id = treino.alunoId
  if (treino.alunoNome !== undefined) map.aluno_nome = treino.alunoNome
  if (treino.dataInicio !== undefined) map.data_inicio = treino.dataInicio
  if (treino.dataTermino !== undefined) map.data_termino = treino.dataTermino
  if (treino.objetivo !== undefined) map.objetivo = treino.objetivo
  if (treino.observacoes !== undefined) map.observacoes = treino.observacoes
  return map
}

export function dbToFicha(row: DbFicha): Ficha {
  return {
    id: row.id,
    treinoId: row.treino_id,
    nome: row.nome,
    diasDaSemana: row.dias_da_semana,
    exercicios: Array.isArray(row.exercicios) ? row.exercicios : [],
    criadoEm: row.criado_em,
  }
}

export function fichaToDb(
  ficha: Omit<Ficha, "id" | "criadoEm">,
  userId: string
): Omit<DbFicha, "id" | "criado_em"> {
  return {
    user_id: userId,
    treino_id: ficha.treinoId,
    nome: ficha.nome,
    dias_da_semana: ficha.diasDaSemana,
    exercicios: ficha.exercicios,
  }
}

export function fichaPartialToDb(
  ficha: Partial<Ficha>
): Partial<Omit<DbFicha, "id" | "user_id" | "criado_em">> {
  const map: Partial<Omit<DbFicha, "id" | "user_id" | "criado_em">> = {}
  if (ficha.treinoId !== undefined) map.treino_id = ficha.treinoId
  if (ficha.nome !== undefined) map.nome = ficha.nome
  if (ficha.diasDaSemana !== undefined) map.dias_da_semana = ficha.diasDaSemana
  if (ficha.exercicios !== undefined) map.exercicios = ficha.exercicios
  return map
}

export function dbToAvaliacao(row: DbAvaliacao): Avaliacao {
  return {
    id: row.id,
    alunoId: row.aluno_id,
    alunoNome: row.aluno_nome,
    dataAvaliacao: row.data_avaliacao,
    medidas: row.medidas,
    fotos: row.fotos,
    observacoes: row.observacoes,
    criadoEm: row.criado_em,
  }
}

export function avaliacaoToDb(
  avaliacao: Omit<Avaliacao, "id" | "criadoEm">,
  userId: string
): Omit<DbAvaliacao, "id" | "criado_em"> {
  return {
    user_id: userId,
    aluno_id: avaliacao.alunoId,
    aluno_nome: avaliacao.alunoNome,
    data_avaliacao: avaliacao.dataAvaliacao,
    medidas: avaliacao.medidas,
    fotos: avaliacao.fotos,
    observacoes: avaliacao.observacoes,
  }
}

export function avaliacaoPartialToDb(
  avaliacao: Partial<Avaliacao>
): Partial<Omit<DbAvaliacao, "id" | "user_id" | "criado_em">> {
  const map: Partial<Omit<DbAvaliacao, "id" | "user_id" | "criado_em">> = {}
  if (avaliacao.alunoId !== undefined) map.aluno_id = avaliacao.alunoId
  if (avaliacao.alunoNome !== undefined) map.aluno_nome = avaliacao.alunoNome
  if (avaliacao.dataAvaliacao !== undefined) map.data_avaliacao = avaliacao.dataAvaliacao
  if (avaliacao.medidas !== undefined) map.medidas = avaliacao.medidas
  if (avaliacao.fotos !== undefined) map.fotos = avaliacao.fotos
  if (avaliacao.observacoes !== undefined) map.observacoes = avaliacao.observacoes
  return map
}
