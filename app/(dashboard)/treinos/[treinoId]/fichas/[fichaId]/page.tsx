"use client"

import { useParams, useRouter } from "next/navigation"
import { useData } from "@/lib/data-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, Edit, Trash } from "lucide-react"

export default function FichaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { treinoId, fichaId } = params as { treinoId: string; fichaId: string }
  const { fichas, deleteFicha } = useData()

  const ficha = fichas.find((f) => f.id === fichaId)
  if (!ficha) return <div>Ficha não encontrada</div>

  const handlePdf = () => {
    const content = `
      <html><head><title>${ficha.nome}</title><style>body{font-family:Inter,system-ui; padding:24px}</style></head><body>
      <h1>${ficha.nome}</h1>
      <p>Dias: ${ficha.diasDaSemana || '-'}</p>
      <h2>Exercícios</h2>
      <ul>${ficha.exercicios.map(e => `<li>${e.nome}</li>`).join('')}</ul>
      </body></html>
    `
    const w = window.open("", "_blank")
    if (!w) return
    w.document.open(); w.document.write(content); w.document.close(); setTimeout(() => w.print(), 300)
  }

  return (
    <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-0">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/treinos/${treinoId}`}>
          <Button variant="ghost" size="sm">Voltar</Button>
        </Link>
        <h1 className="text-2xl font-bold">{ficha.nome}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={handlePdf}><Download className="h-4 w-4" /> PDF</Button>
          <Button variant="ghost" onClick={() => alert('Editar ficha ainda não implementado')}><Edit className="h-4 w-4" /> Editar</Button>
          <Button variant="ghost" onClick={() => { if (confirm('Excluir ficha?')) { deleteFicha(ficha.id); router.push(`/treinos/${treinoId}`) } }} className="text-red-500"><Trash className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card className="border-[#E5E7EB]">
        <CardContent>
          <p className="text-sm text-gray-500 mb-2">Dias</p>
          <div className="p-3 bg-white rounded border border-gray-100">{ficha.diasDaSemana || '-'}</div>
          <h2 className="mt-4 font-semibold">Exercícios</h2>
          <ul className="mt-2 list-disc pl-6 text-gray-700">
            {ficha.exercicios.length === 0 ? <li>Nenhum exercício</li> : ficha.exercicios.map((e) => <li key={e.id}>{e.nome}</li>)}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
