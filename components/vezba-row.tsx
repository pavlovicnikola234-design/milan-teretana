"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { VezbaForm } from "@/components/vezba-form"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteVezba, moveVezba, toggleVezba } from "@/app/vezbaci/[id]/trening/[datum]/actions"
import type { Vezba } from "@/lib/types"

interface VezbaRowProps {
  vezba: Vezba
  vezbacId: string
  treningId: string
  datum: string
  isFirst: boolean
  isLast: boolean
  index: number
}

export function VezbaRow({
  vezba,
  vezbacId,
  treningId,
  datum,
  isFirst,
  isLast,
  index,
}: VezbaRowProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  async function handleDelete() {
    try {
      await deleteVezba(vezbacId, vezba.id, datum)
    } catch {
      alert("Greska pri brisanju vezbe.")
    }
  }

  async function handleMove(direction: "up" | "down") {
    try {
      await moveVezba(vezbacId, treningId, datum, vezba.id, direction)
    } catch {
      alert("Greska pri pomeranju vezbe.")
    }
  }

  async function handleToggle(checked: boolean) {
    try {
      await toggleVezba(vezbacId, vezba.id, datum, checked)
    } catch {
      alert("Greska pri azuriranju vezbe.")
    }
  }

  return (
    <>
      <div className={`rounded-lg border p-3 space-y-2 transition-opacity ${vezba.zavrsena ? "opacity-60" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Checkbox
              checked={vezba.zavrsena}
              onCheckedChange={(checked) => handleToggle(checked === true)}
              className="mt-1 h-5 w-5"
            />
            <div className="min-w-0 flex-1">
              <p className={`font-medium text-base ${vezba.zavrsena ? "line-through text-muted-foreground" : ""}`}>
                <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
                {vezba.naziv}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="secondary">
                  {vezba.serije} x {vezba.ponavljanja}
                </Badge>
                {vezba.kilaza && (
                  <Badge variant="outline">{vezba.kilaza} kg</Badge>
                )}
                {vezba.pauza && (
                  <Badge variant="outline">Pauza: {vezba.pauza}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isFirst}
              onClick={() => handleMove("up")}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isLast}
              onClick={() => handleMove("down")}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>

      <VezbaForm
        open={editOpen}
        onOpenChange={setEditOpen}
        vezbacId={vezbacId}
        treningId={treningId}
        datum={datum}
        vezba={vezba}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Da li zelite da obrisete vezbu "${vezba.naziv}"?`}
      />
    </>
  )
}
