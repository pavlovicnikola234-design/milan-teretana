export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { TreningList } from "@/components/trening-list"
import { NoviTreningForm } from "@/components/novi-trening-form"
import { ShareButton } from "@/components/share-button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TrendingUp, Share2, CalendarPlus, Dumbbell, ChevronRight } from "lucide-react"
import { getAvatarColor, getInitials } from "@/lib/utils"
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
  const initials = getInitials(v.ime, v.prezime)
  const color = getAvatarColor(`${v.ime} ${v.prezime}`)

  const bioStats = [
    v.pol === "Muski" ? "M" : v.pol === "Zenski" ? "Z" : null,
    v.kilaza ? `${v.kilaza} kg` : null,
    v.visina ? `${v.visina} cm` : null,
  ].filter(Boolean)

  const treninziList = (treninzi as Trening[]) || []

  return (
    <>
      <Header
        title={`${v.ime} ${v.prezime}`}
        backHref="/vezbaci"
      />
      <main className="px-4 pt-2 pb-4 max-w-2xl mx-auto space-y-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-4 space-y-3">
          <div
            className={`flex items-center justify-center h-16 w-16 rounded-full text-lg font-bold ${color.bg} ${color.text}`}
          >
            {initials}
          </div>
          <div className="text-center space-y-1.5">
            <h2 className="text-xl font-bold">{v.ime} {v.prezime}</h2>
            {bioStats.length > 0 && (
              <div className="flex items-center justify-center gap-1.5">
                {bioStats.map((stat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-muted/70 px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            )}
            {v.napomena && (
              <p className="text-sm text-muted-foreground max-w-xs">{v.napomena}</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link href={`/vezbaci/${id}/napredak`}>
            <Card size="sm" className="cursor-pointer transition-all duration-150 hover:bg-accent/50 active:bg-accent active:scale-[0.99]">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-500/10 shrink-0">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <span className="font-medium text-sm flex-1">Napredak</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </CardContent>
            </Card>
          </Link>
          <Card size="sm">
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-500/10 shrink-0">
                <Share2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <ShareButton vezbacId={id} existingToken={v.share_token} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Novi Trening */}
        <Card size="sm">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10">
                <CalendarPlus className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium text-sm">Novi trening</span>
            </div>
            <NoviTreningForm vezbacId={id} />
          </CardContent>
        </Card>

        {/* Treninzi Feed */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 py-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-violet-500/10">
              <Dumbbell className="h-4 w-4 text-violet-400" />
            </div>
            <span className="font-medium text-sm">Treninzi</span>
            <Badge variant="secondary" className="text-xs font-normal">
              {treninziList.length}
            </Badge>
          </div>
          <TreningList
            vezbacId={id}
            treninzi={treninziList}
          />
        </div>
      </main>
    </>
  )
}
