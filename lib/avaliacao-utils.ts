import type { Avaliacao } from "@/lib/types"

export const medidasLabels: Record<keyof Avaliacao["medidas"], string> = {
  peso: "Peso",
  altura: "Altura",
  gordura: "% Gordura",
  massaMagra: "Massa Magra",
  cintura: "Cintura",
  quadril: "Quadril",
  peitoral: "Peitoral",
  abdomen: "Abdômen",
  bracoDireito: "Braço Direito",
  bracoEsquerdo: "Braço Esquerdo",
  coxaDireita: "Coxa Direita",
  coxaEsquerda: "Coxa Esquerda",
  panturrilhaDireita: "Panturrilha Dir.",
  panturrilhaEsquerda: "Panturrilha Esq.",
}

export const medidasUnits: Partial<Record<keyof Avaliacao["medidas"], string>> = {
  peso: "kg",
  altura: "cm",
  gordura: "%",
  massaMagra: "kg",
  cintura: "cm",
  quadril: "cm",
  peitoral: "cm",
  abdomen: "cm",
  bracoDireito: "cm",
  bracoEsquerdo: "cm",
  coxaDireita: "cm",
  coxaEsquerda: "cm",
  panturrilhaDireita: "cm",
  panturrilhaEsquerda: "cm",
}

/** Menor gordura/medidas = verde; maior massa magra = verde */
export function deltaTone(
  key: keyof Avaliacao["medidas"],
  delta: number
): "positive" | "negative" | "neutral" {
  if (delta === 0) return "neutral"
  const lowerIsBetter: (keyof Avaliacao["medidas"])[] = [
    "gordura",
    "cintura",
    "quadril",
    "abdomen",
    "peso",
  ]
  const higherIsBetter: (keyof Avaliacao["medidas"])[] = ["massaMagra", "peitoral"]

  if (higherIsBetter.includes(key)) {
    return delta > 0 ? "positive" : "negative"
  }
  if (lowerIsBetter.includes(key)) {
    return delta < 0 ? "positive" : "negative"
  }
  return "neutral"
}

export function formatDelta(delta: number, unit?: string): string {
  const sign = delta > 0 ? "+" : ""
  const u = unit ? ` ${unit}` : ""
  return `${sign}${delta.toFixed(1)}${u}`
}

export function sortAvaliacoesByDate(avaliacoes: Avaliacao[]): Avaliacao[] {
  return [...avaliacoes].sort(
    (a, b) =>
      new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
  )
}
