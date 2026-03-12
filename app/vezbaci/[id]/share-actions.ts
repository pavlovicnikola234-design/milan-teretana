"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function generateShareToken(vezbacId: string): Promise<string> {
  const supabase = createSupabaseClient()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("share_token")
    .eq("id", vezbacId)
    .single()

  if (!vezbac) throw new Error("Vezbac nije pronadjen.")

  if (vezbac.share_token) {
    return vezbac.share_token
  }

  const token = crypto.randomUUID()

  const { error } = await supabase
    .from("vezbaci")
    .update({ share_token: token })
    .eq("id", vezbacId)

  if (error) throw new Error(error.message)
  revalidatePath(`/vezbaci/${vezbacId}`)
  return token
}

export async function regenerateShareToken(vezbacId: string): Promise<string> {
  const supabase = createSupabaseClient()
  const token = crypto.randomUUID()

  const { error } = await supabase
    .from("vezbaci")
    .update({ share_token: token })
    .eq("id", vezbacId)

  if (error) throw new Error(error.message)
  revalidatePath(`/vezbaci/${vezbacId}`)
  return token
}
