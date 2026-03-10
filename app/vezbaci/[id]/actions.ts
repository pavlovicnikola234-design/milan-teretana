"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createTrening(vezbacId: string, datum: string) {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from("treninzi")
    .insert({ vezbac_id: vezbacId, datum })
    .select("id")
    .single()

  if (error) {
    if (error.code === "23505") {
      throw new Error("Trening za ovaj datum vec postoji.")
    }
    throw new Error(error.message)
  }

  revalidatePath(`/vezbaci/${vezbacId}`)
  return data.id
}

export async function deleteTrening(vezbacId: string, treningId: string) {
  const supabase = createSupabaseClient()

  const { error } = await supabase.from("treninzi").delete().eq("id", treningId)

  if (error) throw new Error(error.message)
  revalidatePath(`/vezbaci/${vezbacId}`)
}
