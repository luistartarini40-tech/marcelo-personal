"use client"

import Link from "next/link"
import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth/auth-card"
import { resetPassword } from "@/lib/auth-actions"

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar o email."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Recuperar senha"
      subtitle="Enviaremos um link para redefinir sua senha"
    >
      {success ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-green-600">
            Se o email existir em nossa base, você receberá um link de recuperação.
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Voltar para o login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-[#F1F5F9] border-[#E2E8F0]"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar link"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-500">
            <Link href="/login" className="font-semibold text-gray-700 hover:text-gray-900">
              Voltar para o login
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  )
}
