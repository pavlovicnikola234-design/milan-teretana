"use client"

import { useRouter } from "next/navigation"
import { formatDateSr } from "@/lib/date"
import { CalendarDays } from "lucide-react"
import type { Trening } from "@/lib/types"

interface ReadOnlyTreningListProps {
  token: string
  treninzi: Trening[]
}

export function ReadOnlyTreningList({ token, treninzi }: ReadOnlyTreningListProps) {
  const router = useRouter()

  if (treninzi.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nema treninga</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {treninzi.map((t) => {
        const dateObj = new Date(t.datum + "T00:00:00")
        return (
          <div
            key={t.id}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 active:bg-accent ${t.zavrsen ? "opacity-60" : ""}`}
            onClick={() => router.push(`/plan/${token}/trening/${t.datum}`)}
          >
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className={`flex-1 font-medium text-base ${t.zavrsen ? "line-through text-muted-foreground" : ""}`}>
              {formatDateSr(dateObj, "EEEE, d. MMMM yyyy.")}
            </span>
            {t.napomena && (
              <span className="text-xs text-muted-foreground truncate max-w-24">
                {t.napomena}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
