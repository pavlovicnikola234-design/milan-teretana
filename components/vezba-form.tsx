"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addVezba, updateVezba } from "@/app/vezbaci/[id]/trening/[datum]/actions"
import type { Vezba } from "@/lib/types"

interface VezbaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vezbacId: string
  treningId: string
  datum: string
  vezba?: Vezba
}

export function VezbaForm({
  open,
  onOpenChange,
  vezbacId,
  treningId,
  datum,
  vezba,
}: VezbaFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!vezba

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      if (isEdit) {
        await updateVezba(vezbacId, vezba.id, datum, formData)
      } else {
        await addVezba(vezbacId, treningId, datum, formData)
      }
      onOpenChange(false)
    } catch {
      alert("Greska pri cuvanju vezbe.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Izmeni vezbu" : "Dodaj vezbu"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="naziv">Naziv vezbe *</Label>
            <Input
              id="naziv"
              name="naziv"
              required
              defaultValue={vezba?.naziv}
              placeholder="npr. Bench press"
              className="text-base"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="serije">Serije *</Label>
              <Input
                id="serije"
                name="serije"
                type="number"
                min="1"
                required
                defaultValue={vezba?.serije ?? 3}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ponavljanja">Ponavljanja *</Label>
              <Input
                id="ponavljanja"
                name="ponavljanja"
                required
                defaultValue={vezba?.ponavljanja ?? "10"}
                placeholder="npr. 8-12"
                className="text-base"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="kilaza">Kilaza (kg)</Label>
              <Input
                id="kilaza"
                name="kilaza"
                defaultValue={vezba?.kilaza ?? ""}
                placeholder="npr. 60"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pauza">Pauza</Label>
              <Input
                id="pauza"
                name="pauza"
                defaultValue={vezba?.pauza ?? ""}
                placeholder="npr. 90s"
                className="text-base"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Otkazi
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Cuvam..." : isEdit ? "Sacuvaj" : "Dodaj"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
