export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { TreningList } from "@/components/trening-list"
import { NoviTreningForm } from "@/components/novi-trening-form"
import { Separator } from "@/components/ui/separator"
import type { Vezbac, Trening } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VezbacDetailPage({ params }: PageProps) {
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
    .select("*")
    .eq("vezbac_id", id)
    .order("datum", { ascending: false })

  const v = vezbac as Vezbac

  return (
    <>
      <Header
        title={`${v.ime} ${v.prezime}`}
        backHref="/vezbaci"
      />
      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {v.napomena && (
          <p className="text-sm text-muted-foreground">{v.napomena}</p>
        )}

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Novi trening
          </h2>
          <NoviTreningForm vezbacId={id} />
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Treninzi
          </h2>
          <TreningList
            vezbacId={id}
            treninzi={(treninzi as Trening[]) || []}
          />
        </div>
      </main>
    </>
  )
}
