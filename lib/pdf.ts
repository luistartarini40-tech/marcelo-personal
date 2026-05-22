import type { Ficha, Treino } from "@/lib/types"

const pdfStyles = `
  body { font-family: Inter, system-ui, sans-serif; padding: 32px; color: #0f172a; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  h2 { font-size: 16px; margin: 24px 0 12px; color: #334155; }
  h3 { font-size: 14px; margin: 16px 0 8px; }
  p { margin: 4px 0; color: #64748b; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; }
  th { background: #f8fafc; font-weight: 600; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  .meta { margin-bottom: 20px; }
`

export function openPrintWindow(html: string, title: string) {
  const w = window.open("", "_blank")
  if (!w) {
    alert("Permita pop-ups para baixar o PDF.")
    return
  }
  w.document.open()
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>${pdfStyles}</style></head><body>${html}</body></html>`)
  w.document.close()
  setTimeout(() => w.print(), 400)
}

function exerciciosTable(exercicios: Ficha["exercicios"]) {
  if (exercicios.length === 0) {
    return "<p><em>Nenhum exercício cadastrado.</em></p>"
  }
  const rows = exercicios
    .map(
      (e) => `
    <tr>
      <td>${e.nome || "—"}</td>
      <td>${e.series || "—"}</td>
      <td>${e.reps || "—"}</td>
      <td>${e.carga || "—"}</td>
      <td>${e.descanso || "—"}</td>
    </tr>`
    )
    .join("")
  return `
    <table>
      <thead>
        <tr><th>Exercício</th><th>Séries</th><th>Reps</th><th>Carga</th><th>Descanso</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
}

export function buildFichaPdfHtml(ficha: Ficha, treino?: Treino) {
  return `
    <h1>${ficha.nome}</h1>
    ${treino ? `<p><strong>Programa:</strong> ${treino.nome} · <strong>Aluno:</strong> ${treino.alunoNome}</p>` : ""}
    <p><strong>Dias da semana:</strong> ${ficha.diasDaSemana || "—"}</p>
    <h2>Exercícios</h2>
    ${exerciciosTable(ficha.exercicios)}
  `
}

export function buildProgramaPdfHtml(treino: Treino, fichas: Ficha[]) {
  const fichasHtml = fichas
    .map(
      (f) => `
      <hr/>
      <h3>${f.nome}</h3>
      <p><strong>Dias:</strong> ${f.diasDaSemana || "—"}</p>
      ${exerciciosTable(f.exercicios)}
    `
    )
    .join("")

  return `
    <h1>${treino.nome}</h1>
    <div class="meta">
      <p><strong>Aluno:</strong> ${treino.alunoNome}</p>
      <p><strong>Objetivo:</strong> ${treino.objetivo || "—"}</p>
      <p><strong>Período:</strong> ${treino.dataInicio || "—"} ${treino.dataTermino ? `até ${treino.dataTermino}` : ""}</p>
      ${treino.observacoes ? `<p><strong>Observações:</strong> ${treino.observacoes}</p>` : ""}
    </div>
    <h2>Fichas de Treino (${fichas.length})</h2>
    ${fichas.length ? fichasHtml : "<p><em>Nenhuma ficha cadastrada.</em></p>"}
  `
}

export function printFichaPdf(ficha: Ficha, treino?: Treino) {
  openPrintWindow(buildFichaPdfHtml(ficha, treino), ficha.nome)
}

export function printProgramaPdf(treino: Treino, fichas: Ficha[]) {
  openPrintWindow(buildProgramaPdfHtml(treino, fichas), treino.nome)
}
