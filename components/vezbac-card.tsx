"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Pencil, Trash2, Phone, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { VezbacForm } from "@/components/vezbac-form"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteVezbac } from "@/app/vezbaci/actions"
import { getAvatarColor, getInitials } from "@/lib/utils"
import type { Vezbac } from "@/lib/types"

interface VezbacCardProps {
  vezbac: Vezbac
}

export function VezbacCard({ vezbac }: VezbacCardProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = getInitials(vezbac.ime, vezbac.prezime)
  const color = getAvatarColor(`${vezbac.ime} ${vezbac.prezime}`)

  const bioStats = [
    vezbac.pol === "Muski" ? "M" : vezbac.pol === "Zenski" ? "Z" : null,
    vezbac.kilaza ? `${vezbac.kilaza} kg` : null,
    vezbac.visina ? `${vezbac.visina} cm` : null,
  ].filter(Boolean)

  async function handleDelete() {
    try {
      await deleteVezbac(vezbac.id)
    } catch {
      alert("Greska pri brisanju.")
    }
  }

  return (
    <>
      <Card
        size="sm"
        className="cursor-pointer transition-all duration-150 hover:bg-accent/50 active:bg-accent active:scale-[0.99]"
        onClick={() => router.push(`/vezbaci/${vezbac.id}`)}
      >
        <CardContent className="flex items-center gap-3 p-3">
          {/* Avatar */}
          <div
            className={`flex items-center justify-center h-11 w-11 rounded-full shrink-0 text-sm font-semibold ${color.bg} ${color.text}`}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[0.94rem] leading-tight truncate">
              {vezbac.ime} {vezbac.prezime}
            </p>
            {vezbac.telefon && (
              <p className="text-[0.8rem] text-muted-foreground flex items-center gap-1.5 mt-1">
                <Phone className="h-3 w-3 shrink-0" />
                <span className="truncate">{vezbac.telefon}</span>
              </p>
            )}
            {bioStats.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                {bioStats.map((stat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md bg-muted/70 px-1.5 py-0.5 text-[0.7rem] text-muted-foreground"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  />
                }
              >
                <MoreVertical className="h-4 w-4" />
              </PopoverTrigger>
              <PopoverContent
                className="w-40 p-1"
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-9"
                  onClick={() => {
                    setMenuOpen(false)
                    setEditOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Izmeni
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive"
                  onClick={() => {
                    setMenuOpen(false)
                    setDeleteOpen(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Obrisi
                </Button>
              </PopoverContent>
            </Popover>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          </div>
        </CardContent>
      </Card>

      <VezbacForm
        open={editOpen}
        onOpenChange={setEditOpen}
        vezbac={vezbac}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Da li zelite da obrisete vezbaca ${vezbac.ime} ${vezbac.prezime}? Svi njegovi treninzi ce takodje biti obrisani.`}
      />
    </>
  )
}
