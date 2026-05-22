"use client"

import { createClient } from "@/lib/supabase/client"

export function getRedirectUrl(path = "/auth/callback") {
  return `${window.location.origin}${path}`
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signUpWithEmail(email: string, password: string, nome: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nome },
      emailRedirectTo: getRedirectUrl(),
    },
  })
  if (error) throw error
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/login`,
  })
  if (error) throw error
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
