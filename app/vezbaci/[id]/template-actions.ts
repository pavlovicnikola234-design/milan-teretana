"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface Sablon {
  id: string
  naziv: string
  created_at: string
  vezbe: SablonVezba[]
}

export interface SablonVezba {
  id: string
  sablon_id: string
  redosled: number
  naziv: string
  serije: number
  ponavljanja: string
  kilaza: string | null
  pauza: string | null
}

export async function saveAsTemplate(
  vezbacId: string,
  treningId: string,
  datum: string,
  naziv: string
) {
  const supabase = createSupabaseClient()

  const { data: vezbe } = await supabase
    .from("vezbe")
    .select("*")
    .eq("trening_id", treningId)
    .order("redosled", { ascending: true })

  if (!vezbe || vezbe.length === 0) {
    throw new Error("Nema vezbi za cuvanje u sablon.")
  }

  const { data: sablon, error: sablonError } = await supabase
    .from("sabloni")
    .insert({ naziv })
    .select()
    .single()

  if (sablonError) throw new Error(sablonError.message)

  const sablonVezbe = vezbe.map((v: any, idx: number) => ({
    sablon_id: sablon.id,
    redosled: idx,
    naziv: v.naziv,
    serije: v.serije,
    ponavljanja: v.ponavljanja,
    kilaza: v.kilaza,
    pauza: v.pauza,
  }))

  const { error: vezbeError } = await supabase
    .from("sablon_vezbe")
    .insert(sablonVezbe)

  if (vezbeError) throw new Error(vezbeError.message)
}

export async function getSabloni(): Promise<Sablon[]> {
  const supabase = createSupabaseClient()

  const { data: sabloni } = await supabase
    .from("sabloni")
    .select("*")
    .order("created_at", { ascending: false })

  if (!sabloni) return []

  const { data: sveVezbe } = await supabase
    .from("sablon_vezbe")
    .select("*")
    .in("sablon_id", sabloni.map((s: any) => s.id))
    .order("redosled", { ascending: true })

  return sabloni.map((s: any) => ({
    ...s,
    vezbe: (sveVezbe || []).filter((v: any) => v.sablon_id === s.id),
  }))
}

export async function applyTemplate(
  vezbacId: string,
  treningId: string,
  datum: string,
  sablonId: string
) {
  const supabase = createSupabaseClient()

  const { data: sablonVezbe } = await supabase
    .from("sablon_vezbe")
    .select("*")
    .eq("sablon_id", sablonId)
    .order("redosled", { ascending: true })

  if (!sablonVezbe || sablonVezbe.length === 0) {
    throw new Error("Sablon je prazan.")
  }

  // Get current max redosled
  const { data: existing } = await supabase
    .from("vezbe")
    .select("redosled")
    .eq("trening_id", treningId)
    .order("redosled", { ascending: false })
    .limit(1)

  const startOrder = existing && existing.length > 0 ? existing[0].redosled + 1 : 0

  const newVezbe = sablonVezbe.map((v: any, idx: number) => ({
    trening_id: treningId,
    redosled: startOrder + idx,
    naziv: v.naziv,
    serije: v.serije,
    ponavljanja: v.ponavljanja,
    kilaza: v.kilaza,
    pauza: v.pauza,
    zavrsena: false,
  }))

  const { error } = await supabase.from("vezbe").insert(newVezbe)
  if (error) throw new Error(error.message)

  revalidatePath(`/vezbaci/${vezbacId}/trening/${datum}`)
}

export async function deleteTemplate(sablonId: string) {
  const supabase = createSupabaseClient()
  const { error } = await supabase
    .from("sabloni")
    .delete()
    .eq("id", sablonId)

  if (error) throw new Error(error.message)
}
