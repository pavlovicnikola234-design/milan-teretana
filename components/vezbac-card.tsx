"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Pencil, Trash2, Phone } from "lucide-react"
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
import type { Vezbac } from "@/lib/types"

interface VezbacCardProps {
  vezbac: Vezbac
}

export function VezbacCard({ vezbac }: VezbacCardProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
        className="cursor-pointer transition-colors hover:bg-accent/50 active:bg-accent"
        onClick={() => router.push(`/vezbaci/${vezbac.id}`)}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-base truncate">
              {vezbac.ime} {vezbac.prezime}
            </p>
            {vezbac.telefon && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <Phone className="h-3 w-3" />
                {vezbac.telefon}
              </p>
            )}
          </div>
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
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
