export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { NapredakClient } from "./page-client"
import type { Vezbac } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NapredakPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createSupabaseClient()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("*")
    .eq("id", id)
    .single()

  if (!vezbac) notFound()

  const { data: treninzi } = await supabase
    .from("treninzi")
    .select("id, datum")
    .eq("vezbac_id", id)
    .order("datum", { ascending: true })

  if (!treninzi || treninzi.length === 0) {
    return (
      <>
        <Header title="Napredak" backHref={`/vezbaci/${id}`} />
        <main className="p-4 max-w-2xl mx-auto">
          <p className="text-center text-muted-foreground py-8">Nema treninga za prikaz</p>
        </main>
      </>
    )
  }

  const treningIds = treninzi.map((t: any) => t.id)

  const { data: vezbe } = await supabase
    .from("vezbe")
    .select("naziv, kilaza, trening_id")
    .in("trening_id", treningIds)

  // Build data: group by exercise name, with date and kilaza
  const treningDatumMap: Record<string, string> = {}
  for (const t of treninzi) {
    treningDatumMap[t.id] = t.datum
  }

  interface DataPoint {
    datum: string
    kilaza: number
  }

  const exerciseMap: Record<string, DataPoint[]> = {}

  for (const v of vezbe || []) {
    if (!v.kilaza) continue
    const { parseKilaza } = await import("@/lib/parse-kilaza")
    const kg = parseKilaza(v.kilaza)
    if (kg === null) continue

    const datum = treningDatumMap[v.trening_id]
    if (!datum) continue

    if (!exerciseMap[v.naziv]) exerciseMap[v.naziv] = []
    exerciseMap[v.naziv].push({ datum, kilaza: kg })
  }

  // Sort each exercise's data by date
  for (const key of Object.keys(exerciseMap)) {
    exerciseMap[key].sort((a, b) => a.datum.localeCompare(b.datum))
  }

  const v = vezbac as Vezbac

  return (
    <>
      <Header title={`Napredak - ${v.ime} ${v.prezime}`} backHref={`/vezbaci/${id}`} />
      <main className="px-4 pt-2 pb-4 max-w-2xl mx-auto space-y-4">
        <NapredakClient exerciseData={exerciseMap} />
      </main>
    </>
  )
}
