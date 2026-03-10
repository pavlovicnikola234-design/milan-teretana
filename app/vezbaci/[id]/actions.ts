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

export async function duplicateTrening(
  vezbacId: string,
  treningId: string,
  newDatum: string
) {
  const supabase = createSupabaseClient()

  // Create new training for the target date
  const { data: newTrening, error: treningError } = await supabase
    .from("treninzi")
    .insert({ vezbac_id: vezbacId, datum: newDatum })
    .select("id")
    .single()

  if (treningError) {
    if (treningError.code === "23505") {
      throw new Error("Trening za ovaj datum vec postoji.")
    }
    throw new Error(treningError.message)
  }

  // Copy all exercises from source training
  const { data: vezbe } = await supabase
    .from("vezbe")
    .select("redosled, naziv, serije, ponavljanja, kilaza, pauza")
    .eq("trening_id", treningId)
    .order("redosled", { ascending: true })

  if (vezbe && vezbe.length > 0) {
    const newVezbe = vezbe.map((v) => ({
      ...v,
      trening_id: newTrening.id,
    }))
    await supabase.from("vezbe").insert(newVezbe)
  }

  revalidatePath(`/vezbaci/${vezbacId}`)
  return newTrening.id
}

export async function deleteTrening(vezbacId: string, treningId: string) {
  const supabase = createSupabaseClient()

  const { error } = await supabase.from("treninzi").delete().eq("id", treningId)

  if (error) throw new Error(error.message)
  revalidatePath(`/vezbaci/${vezbacId}`)
}
