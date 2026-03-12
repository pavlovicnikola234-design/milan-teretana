"use server"

import { createSupabaseClient } from "@/lib/supabase"
import type { BibliotekaVezba } from "@/lib/types"

export async function searchLibrary(query: string): Promise<BibliotekaVezba[]> {
  if (!query || query.length < 2) return []

  const supabase = createSupabaseClient()
  const { data } = await supabase
    .from("biblioteka_vezbi")
    .select("*")
    .ilike("naziv", `%${query}%`)
    .order("naziv")
    .limit(8)

  return (data as BibliotekaVezba[]) || []
}

export async function saveToLibrary(
  naziv: string,
  serije: number,
  ponavljanja: string,
  kilaza: string | null,
  pauza: string | null
) {
  const supabase = createSupabaseClient()

  const { data: existing } = await supabase
    .from("biblioteka_vezbi")
    .select("id")
    .eq("naziv", naziv)
    .single()

  if (existing) {
    await supabase
      .from("biblioteka_vezbi")
      .update({
        default_serije: serije,
        default_ponavljanja: ponavljanja,
        default_kilaza: kilaza || null,
        default_pauza: pauza || null,
      })
      .eq("id", existing.id)
  } else {
    await supabase.from("biblioteka_vezbi").insert({
      naziv,
      default_serije: serije,
      default_ponavljanja: ponavljanja,
      default_kilaza: kilaza || null,
      default_pauza: pauza || null,
    })
  }
}
