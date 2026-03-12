export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { formatDateSr } from "@/lib/date"
import { Header } from "@/components/header"
import { ReadOnlyVezbaRow } from "@/components/read-only-vezba-row"
import { Separator } from "@/components/ui/separator"
import type { Vezbac, Trening, Vezba } from "@/lib/types"

interface PageProps {
  params: Promise<{ token: string; datum: string }>
}

export default async function PublicTreningPage({ params }: PageProps) {
  const { token, datum } = await params
  const supabase = createSupabaseClient()

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(token)) notFound()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("*")
    .eq("share_token", token)
    .single()

  if (!vezbac) notFound()

  const { data: trening } = await supabase
    .from("treninzi")
    .select("*")
    .eq("vezbac_id", vezbac.id)
    .eq("datum", datum)
    .single()

  if (!trening) notFound()

  const { data: vezbe } = await supabase
    .from("vezbe")
    .select("*")
    .eq("trening_id", trening.id)
    .order("redosled", { ascending: true })

  const v = vezbac as Vezbac
  const t = trening as Trening
  const vezbeList = (vezbe as Vezba[]) || []
  const dateObj = new Date(datum + "T00:00:00")
  const dateStr = formatDateSr(dateObj, "EEEE, d. MMMM yyyy.")

  return (
    <>
      <Header
        title={`${v.ime} ${v.prezime}`}
        backHref={`/plan/${token}`}
      />
      <main className="p-4 max-w-2xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
        </div>

        {vezbeList.length > 0 ? (
          <div className="space-y-3">
            {vezbeList.map((vezba, idx) => (
              <ReadOnlyVezbaRow
                key={vezba.id}
                vezba={vezba}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nema vezbi</p>
          </div>
        )}

        {t.napomena && (
          <>
            <Separator />
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Napomena
              </h2>
              <p className="text-sm text-muted-foreground">{t.napomena}</p>
            </div>
          </>
        )}
      </main>
    </>
  )
}
