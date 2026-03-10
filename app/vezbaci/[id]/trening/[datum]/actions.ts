"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

function treningPath(vezbacId: string, datum: string) {
  return `/vezbaci/${vezbacId}/trening/${datum}`
}

export async function addVezba(
  vezbacId: string,
  treningId: string,
  datum: string,
  formData: FormData
) {
  const supabase = createSupabaseClient()

  // Get next order number
  const { data: existing } = await supabase
    .from("vezbe")
    .select("redosled")
    .eq("trening_id", treningId)
    .order("redosled", { ascending: false })
    .limit(1)

  const nextOrder = existing && existing.length > 0 ? existing[0].redosled + 1 : 0

  const { error } = await supabase.from("vezbe").insert({
    trening_id: treningId,
    redosled: nextOrder,
    naziv: formData.get("naziv") as string,
    serije: parseInt(formData.get("serije") as string),
    ponavljanja: formData.get("ponavljanja") as string,
    kilaza: (formData.get("kilaza") as string) || null,
    pauza: (formData.get("pauza") as string) || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath(treningPath(vezbacId, datum))
}

export async function updateVezba(
  vezbacId: string,
  vezbaId: string,
  datum: string,
  formData: FormData
) {
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from("vezbe")
    .update({
      naziv: formData.get("naziv") as string,
      serije: parseInt(formData.get("serije") as string),
      ponavljanja: formData.get("ponavljanja") as string,
      kilaza: (formData.get("kilaza") as string) || null,
      pauza: (formData.get("pauza") as string) || null,
    })
    .eq("id", vezbaId)

  if (error) throw new Error(error.message)
  revalidatePath(treningPath(vezbacId, datum))
}

export async function deleteVezba(
  vezbacId: string,
  vezbaId: string,
  datum: string
) {
  const supabase = createSupabaseClient()

  const { error } = await supabase.from("vezbe").delete().eq("id", vezbaId)

  if (error) throw new Error(error.message)
  revalidatePath(treningPath(vezbacId, datum))
}

export async function updateNapomena(
  vezbacId: string,
  treningId: string,
  datum: string,
  napomena: string
) {
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from("treninzi")
    .update({ napomena: napomena || null })
    .eq("id", treningId)

  if (error) throw new Error(error.message)
  revalidatePath(treningPath(vezbacId, datum))
}

export async function moveVezba(
  vezbacId: string,
  treningId: string,
  datum: string,
  vezbaId: string,
  direction: "up" | "down"
) {
  const supabase = createSupabaseClient()

  // Get all exercises ordered
  const { data: vezbe } = await supabase
    .from("vezbe")
    .select("id, redosled")
    .eq("trening_id", treningId)
    .order("redosled", { ascending: true })

  if (!vezbe) return

  const idx = vezbe.findIndex((v) => v.id === vezbaId)
  if (idx === -1) return
  if (direction === "up" && idx === 0) return
  if (direction === "down" && idx === vezbe.length - 1) return

  const swapIdx = direction === "up" ? idx - 1 : idx + 1
  const tempOrder = vezbe[idx].redosled
  vezbe[idx].redosled = vezbe[swapIdx].redosled
  vezbe[swapIdx].redosled = tempOrder

  await supabase
    .from("vezbe")
    .update({ redosled: vezbe[idx].redosled })
    .eq("id", vezbe[idx].id)

  await supabase
    .from("vezbe")
    .update({ redosled: vezbe[swapIdx].redosled })
    .eq("id", vezbe[swapIdx].id)

  revalidatePath(treningPath(vezbacId, datum))
}
