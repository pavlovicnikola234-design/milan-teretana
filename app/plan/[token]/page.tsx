export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { ReadOnlyTreningList } from "@/components/read-only-trening-list"
import { Separator } from "@/components/ui/separator"
import type { Vezbac, Trening } from "@/lib/types"

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function PublicPlanPage({ params }: PageProps) {
  const { token } = await params
  const supabase = createSupabaseClient()

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(token)) notFound()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("*")
    .eq("share_token", token)
    .single()

  if (!vezbac) notFound()

  const { data: treninzi } = await supabase
    .from("treninzi")
    .select("*")
    .eq("vezbac_id", vezbac.id)
    .order("datum", { ascending: false })

  const v = vezbac as Vezbac

  return (
    <>
      <Header title={`Plan - ${v.ime} ${v.prezime}`} />
      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {v.napomena && (
          <p className="text-sm text-muted-foreground">{v.napomena}</p>
        )}

        <Separator />

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Treninzi
          </h2>
          <ReadOnlyTreningList
            token={token}
            treninzi={(treninzi as Trening[]) || []}
          />
        </div>
      </main>
    </>
  )
}
