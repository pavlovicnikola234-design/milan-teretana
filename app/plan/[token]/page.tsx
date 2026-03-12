export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { ReadOnlyTreningList } from "@/components/read-only-trening-list"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Info } from "lucide-react"
import { getAvatarColor, getInitials } from "@/lib/utils"
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
  const initials = getInitials(v.ime, v.prezime)
  const color = getAvatarColor(`${v.ime} ${v.prezime}`)
  const treninziList = (treninzi as Trening[]) || []

  return (
    <>
      <Header title={`Plan - ${v.ime} ${v.prezime}`} />
      <main className="px-4 pt-2 pb-4 max-w-2xl mx-auto space-y-4">
        {/* Profile Banner */}
        <div className="flex flex-col items-center py-4 space-y-3">
          <div
            className={`flex items-center justify-center h-16 w-16 rounded-full text-lg font-bold ${color.bg} ${color.text}`}
          >
            {initials}
          </div>
          <h2 className="text-xl font-bold">{v.ime} {v.prezime}</h2>
        </div>

        {v.napomena && (
          <Card size="sm">
            <CardContent className="flex items-start gap-3 p-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 shrink-0 mt-0.5">
                <Info className="h-4 w-4 text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground">{v.napomena}</p>
            </CardContent>
          </Card>
        )}

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
          <ReadOnlyTreningList
            token={token}
            treninzi={treninziList}
          />
        </div>
      </main>
    </>
  )
}
