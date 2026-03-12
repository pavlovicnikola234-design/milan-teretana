"use client"

import { useRouter } from "next/navigation"
import { formatDateSr } from "@/lib/date"
import { CalendarDays, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Trening } from "@/lib/types"

interface ReadOnlyTreningListProps {
  token: string
  treninzi: Trening[]
}

export function ReadOnlyTreningList({ token, treninzi }: ReadOnlyTreningListProps) {
  const router = useRouter()

  if (treninzi.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-base font-medium">Nema treninga</p>
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {treninzi.map((t) => {
        const dateObj = new Date(t.datum + "T00:00:00")
        const dayName = formatDateSr(dateObj, "EEEE")
        const fullDate = formatDateSr(dateObj, "d. MMMM yyyy.")
        return (
          <Card
            key={t.id}
            size="sm"
            className={`cursor-pointer transition-all duration-150 hover:bg-accent/50 active:bg-accent active:scale-[0.99] ${t.zavrsen ? "opacity-60" : ""}`}
            onClick={() => router.push(`/plan/${token}/trening/${t.datum}`)}
          >
            <CardContent className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-[0.94rem] leading-tight capitalize ${t.zavrsen ? "line-through text-muted-foreground" : ""}`}>
                  {dayName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{fullDate}</p>
                {t.napomena && (
                  <p className="text-xs text-muted-foreground/70 italic mt-1 truncate">
                    {t.napomena}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
