"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExerciseSearch } from "@/components/exercise-search"
import { addVezba, updateVezba } from "@/app/vezbaci/[id]/trening/[datum]/actions"
import { saveToLibrary } from "@/app/vezbaci/[id]/trening/[datum]/library-actions"
import type { Vezba, BibliotekaVezba } from "@/lib/types"

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

  const serijeRef = useRef<HTMLInputElement>(null)
  const ponavljanjaRef = useRef<HTMLInputElement>(null)
  const kilazaRef = useRef<HTMLInputElement>(null)
  const pauzaRef = useRef<HTMLInputElement>(null)

  function handleExerciseSelect(exercise: BibliotekaVezba) {
    if (exercise.default_serije && serijeRef.current) {
      serijeRef.current.value = String(exercise.default_serije)
    }
    if (exercise.default_ponavljanja && ponavljanjaRef.current) {
      ponavljanjaRef.current.value = exercise.default_ponavljanja
    }
    if (exercise.default_kilaza && kilazaRef.current) {
      kilazaRef.current.value = exercise.default_kilaza
    }
    if (exercise.default_pauza && pauzaRef.current) {
      pauzaRef.current.value = exercise.default_pauza
    }
  }

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

      // Save to library in background
      const naziv = formData.get("naziv") as string
      const serije = parseInt(formData.get("serije") as string)
      const ponavljanja = formData.get("ponavljanja") as string
      const kilaza = formData.get("kilaza") as string
      const pauza = formData.get("pauza") as string
      if (naziv) {
        saveToLibrary(naziv, serije, ponavljanja, kilaza, pauza).catch(() => {})
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
            <ExerciseSearch
              id="naziv"
              name="naziv"
              required
              defaultValue={vezba?.naziv ?? ""}
              onSelect={handleExerciseSelect}
              placeholder="npr. Bench press"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="serije">Serije *</Label>
              <Input
                ref={serijeRef}
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
                ref={ponavljanjaRef}
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
                ref={kilazaRef}
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
                ref={pauzaRef}
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
