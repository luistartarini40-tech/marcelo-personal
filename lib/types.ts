export interface Aluno {
  id: string
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  genero: string
  objetivo: string
  observacoes: string
  criadoEm: string
}

export interface Treino {
  id: string
  nome: string
  alunoId: string
  alunoNome: string
  dataInicio: string
  dataTermino: string
  objetivo: string
  observacoes: string
  criadoEm: string
}

export interface Exercicio {
  id: string
  nome: string
  series?: string
  reps?: string
  carga?: string
  descanso?: string
  observacoes?: string
}

export interface Ficha {
  id: string
  treinoId: string
  nome: string
  diasDaSemana: string
  exercicios: Exercicio[]
  criadoEm: string
}

export interface Avaliacao {
  id: string
  alunoId: string
  alunoNome: string
  dataAvaliacao: string
  medidas: {
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
  }
  fotos: {
    frente: string | null
    lateral: string | null
    costas: string | null
  }
  observacoes: string
  criadoEm: string
}

export interface Usuario {
  nome: string
  cargo: string
  iniciais: string
}
