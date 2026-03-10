"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { sr } from "date-fns/locale"
import { CalendarDays, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteTrening } from "@/app/vezbaci/[id]/actions"
import type { Trening } from "@/lib/types"

interface TreningListProps {
  vezbacId: string
  treninzi: Trening[]
}

export function TreningList({ vezbacId, treninzi }: TreningListProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteTrening(vezbacId, deleteId)
    } catch {
      alert("Greska pri brisanju treninga.")
    }
    setDeleteId(null)
  }

  if (treninzi.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nema treninga</p>
        <p className="text-sm mt-1">Izaberite datum i kreirajte novi trening</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {treninzi.map((t) => {
          const dateObj = new Date(t.datum + "T00:00:00")
          return (
            <div
              key={t.id}
              className="flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 active:bg-accent"
              onClick={() => router.push(`/vezbaci/${vezbacId}/trening/${t.datum}`)}
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 font-medium text-base">
                {format(dateObj, "EEEE, d. MMMM yyyy.", { locale: sr })}
              </span>
              {t.napomena && (
                <span className="text-xs text-muted-foreground truncate max-w-24">
                  {t.napomena}
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteId(t.id)
                }}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )
        })}
      </div>

      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        description="Da li zelite da obrisete ovaj trening? Sve vezbe ce takodje biti obrisane."
      />
    </>
  )
}
