"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, Pencil, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { VezbaForm } from "@/components/vezba-form"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { RestTimer } from "@/components/rest-timer"
import { deleteVezba, moveVezba, toggleVezba } from "@/app/vezbaci/[id]/trening/[datum]/actions"
import { parsePauza } from "@/lib/parse-pauza"
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
  const [menuOpen, setMenuOpen] = useState(false)

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
      <Card size="sm" className={`transition-opacity ${vezba.zavrsena ? "opacity-60" : ""}`}>
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <Checkbox
                checked={vezba.zavrsena}
                onCheckedChange={(checked) => handleToggle(checked === true)}
                className="mt-1 h-5 w-5"
              />
              <div className="min-w-0 flex-1">
                <p className={`font-semibold text-[0.94rem] leading-tight ${vezba.zavrsena ? "line-through text-muted-foreground" : ""}`}>
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-[0.65rem] font-bold mr-1.5 align-text-bottom">
                    {index + 1}
                  </span>
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
                {vezba.pauza && parsePauza(vezba.pauza) && (
                  <div className="mt-2">
                    <RestTimer seconds={parsePauza(vezba.pauza)!} />
                  </div>
                )}
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
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    />
                  }
                >
                  <MoreVertical className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1" align="end">
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
            </div>
          </div>
        </CardContent>
      </Card>

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
