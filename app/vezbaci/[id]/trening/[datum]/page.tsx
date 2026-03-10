export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { formatDateSr } from "@/lib/date"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { VezbaRow } from "@/components/vezba-row"
import { NapomenaField } from "@/components/napomena-field"
import { Separator } from "@/components/ui/separator"
import { TreningPageClient } from "./page-client"
import type { Vezbac, Trening, Vezba } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string; datum: string }>
}

export default async function TreningPage({ params }: PageProps) {
  const { id, datum } = await params
  const supabase = createSupabaseClient()

  const { data: vezbac } = await supabase
    .from("vezbaci")
    .select("*")
    .eq("id", id)
    .single()

  if (!vezbac) notFound()

  const { data: trening } = await supabase
    .from("treninzi")
    .select("*")
    .eq("vezbac_id", id)
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
        backHref={`/vezbaci/${id}`}
      />
      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-24">
        <div>
          <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
        </div>

        <TreningPageClient
          vezbacId={id}
          treningId={t.id}
          datum={datum}
        >
          {vezbeList.length > 0 ? (
            <div className="space-y-3">
              {vezbeList.map((vezba, idx) => (
                <VezbaRow
                  key={vezba.id}
                  vezba={vezba}
                  vezbacId={id}
                  treningId={t.id}
                  datum={datum}
                  isFirst={idx === 0}
                  isLast={idx === vezbeList.length - 1}
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nema vezbi</p>
              <p className="text-sm mt-1">Dodajte prvu vezbu klikom na dugme ispod</p>
            </div>
          )}
        </TreningPageClient>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Napomena
          </h2>
          <NapomenaField
            vezbacId={id}
            treningId={t.id}
            datum={datum}
            initialValue={t.napomena || ""}
          />
        </div>
      </main>
    </>
  )
}
