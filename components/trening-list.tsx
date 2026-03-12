"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDateSr } from "@/lib/date"
import { CalendarDays, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteTrening } from "@/app/vezbaci/[id]/actions"
import { toggleTrening } from "@/app/vezbaci/[id]/trening/[datum]/actions"
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

  async function handleToggle(trening: Trening, checked: boolean) {
    try {
      await toggleTrening(vezbacId, trening.id, trening.datum, checked)
    } catch {
      alert("Greska pri azuriranju treninga.")
    }
  }

  if (treninzi.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-base font-medium">Nema treninga</p>
        <p className="text-sm mt-1">Izaberite datum i kreirajte novi trening</p>
      </div>
    )
  }

  return (
    <>
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
            >
              <CardContent className="flex items-center gap-3 p-3">
                <Checkbox
                  checked={t.zavrsen}
                  onCheckedChange={(checked) => handleToggle(t, checked === true)}
                  className="h-5 w-5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <div
                  className="flex-1 min-w-0"
                  onClick={() => router.push(`/vezbaci/${vezbacId}/trening/${t.datum}`)}
                >
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
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteId(t.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <ChevronRight
                    className="h-4 w-4 text-muted-foreground/50 cursor-pointer"
                    onClick={() => router.push(`/vezbaci/${vezbacId}/trening/${t.datum}`)}
                  />
                </div>
              </CardContent>
            </Card>
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
