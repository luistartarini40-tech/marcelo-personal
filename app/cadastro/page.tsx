"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthCard } from "@/components/auth/auth-card"
import { signUpWithEmail } from "@/lib/auth-actions"

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await signUpWithEmail(email, password, nome)
      router.push("/login?registered=true")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível criar a conta."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Criar conta no Evolução Fit"
      subtitle="Cadastre-se para começar"
    >
      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="pl-10 h-11 bg-[#F1F5F9] border-[#E2E8F0]"
              required
              disabled={loading}
            />
          </div>
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 bg-[#F1F5F9] border-[#E2E8F0]"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-[#1E293B] hover:bg-[#0F172A] text-white"
          disabled={loading}
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-semibold text-gray-700 hover:text-gray-900">
          Entrar
        </Link>
      </p>
    </AuthCard>
  )
}
