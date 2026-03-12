"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

async function validateTokenOwnsVezba(token: string, vezbaId: string) {
  const supabase = createSupabaseClient()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("id")
    .eq("share_token", token)
    .single()

  if (!vezbac) throw new Error("Nevazeci token.")

  const { data: vezba } = await supabase
    .from("vezbe")
    .select("id, trening_id")
    .eq("id", vezbaId)
    .single()

  if (!vezba) throw new Error("Vezba nije pronadjena.")

  const { data: trening } = await supabase
    .from("treninzi")
    .select("id, datum")
    .eq("id", vezba.trening_id)
    .eq("vezbac_id", vezbac.id)
    .single()

  if (!trening) throw new Error("Neovlascen pristup.")

  return { vezbac, trening }
}

export async function publicToggleVezba(
  token: string,
  vezbaId: string,
  datum: string,
  zavrsena: boolean
) {
  await validateTokenOwnsVezba(token, vezbaId)

  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from("vezbe")
    .update({ zavrsena })
    .eq("id", vezbaId)

  if (error) throw new Error(error.message)
  revalidatePath(`/plan/${token}/trening/${datum}`)
}

async function validateTokenOwnsTrening(token: string, treningId: string) {
  const supabase = createSupabaseClient()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("id")
    .eq("share_token", token)
    .single()

  if (!vezbac) throw new Error("Nevazeci token.")

  const { data: trening } = await supabase
    .from("treninzi")
    .select("id, datum")
    .eq("id", treningId)
    .eq("vezbac_id", vezbac.id)
    .single()

  if (!trening) throw new Error("Neovlascen pristup.")

  return { vezbac, trening }
}

export async function publicUpdateKomentar(
  token: string,
  treningId: string,
  datum: string,
  komentar: string
) {
  await validateTokenOwnsTrening(token, treningId)

  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from("treninzi")
    .update({ komentar_vezbaca: komentar || null })
    .eq("id", treningId)

  if (error) throw new Error(error.message)
  revalidatePath(`/plan/${token}/trening/${datum}`)
}
