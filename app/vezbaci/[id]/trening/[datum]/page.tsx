export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { formatDateSr } from "@/lib/date"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { VezbaRow } from "@/components/vezba-row"
import { NapomenaField } from "@/components/napomena-field"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TreningPageClient } from "./page-client"
import { CalendarDays, Dumbbell, MessageSquare, MessageCircle } from "lucide-react"
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
  const dayName = formatDateSr(dateObj, "EEEE")
  const fullDate = formatDateSr(dateObj, "d. MMMM yyyy.")

  return (
    <>
      <Header
        title={`${v.ime} ${v.prezime}`}
        backHref={`/vezbaci/${id}`}
      />
      <main className="px-4 pt-2 pb-32 max-w-2xl mx-auto space-y-4">
        {/* Date Hero Card */}
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 shrink-0">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-base capitalize">{dayName}</p>
              <p className="text-xs text-muted-foreground">{fullDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Exercises Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 py-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-500/10">
              <Dumbbell className="h-4 w-4 text-violet-400" />
            </div>
            <span className="font-medium text-sm">Vezbe</span>
            <Badge variant="secondary" className="text-xs font-normal">
              {vezbeList.length}
            </Badge>
          </div>

          <TreningPageClient
            vezbacId={id}
            treningId={t.id}
            datum={datum}
          >
            {vezbeList.length > 0 ? (
              <div className="space-y-2.5">
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
              <div className="text-center py-16 text-muted-foreground">
                <Dumbbell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-base font-medium">Nema vezbi</p>
                <p className="text-sm mt-1">Dodajte prvu vezbu klikom na + dugme</p>
              </div>
            )}
          </TreningPageClient>
        </div>

        {/* Napomena Section */}
        <Card size="sm">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-500/10">
                <MessageSquare className="h-4 w-4 text-amber-400" />
              </div>
              <span className="font-medium text-sm">Napomena</span>
            </div>
            <NapomenaField
              vezbacId={id}
              treningId={t.id}
              datum={datum}
              initialValue={t.napomena || ""}
            />
          </CardContent>
        </Card>

        {/* Komentar Vezbaca */}
        {t.komentar_vezbaca && (
          <Card size="sm">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/10">
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="font-medium text-sm">Komentar vezbaca</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.komentar_vezbaca}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
