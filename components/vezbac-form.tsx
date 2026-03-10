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
import { Textarea } from "@/components/ui/textarea"
import { addVezbac, updateVezbac } from "@/app/vezbaci/actions"
import type { Vezbac } from "@/lib/types"

interface VezbacFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vezbac?: Vezbac
}

export function VezbacForm({ open, onOpenChange, vezbac }: VezbacFormProps) {
  const [loading, setLoading] = useState(false)
  const isEdit = !!vezbac

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      if (isEdit) {
        await updateVezbac(vezbac.id, formData)
      } else {
        await addVezbac(formData)
      }
      onOpenChange(false)
    } catch {
      alert("Greska pri cuvanju. Pokusajte ponovo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Izmeni vezbaca" : "Dodaj vezbaca"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ime">Ime *</Label>
            <Input
              id="ime"
              name="ime"
              required
              defaultValue={vezbac?.ime}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prezime">Prezime *</Label>
            <Input
              id="prezime"
              name="prezime"
              required
              defaultValue={vezbac?.prezime}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefon">Telefon</Label>
            <Input
              id="telefon"
              name="telefon"
              type="tel"
              defaultValue={vezbac?.telefon ?? ""}
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="napomena">Napomena</Label>
            <Textarea
              id="napomena"
              name="napomena"
              defaultValue={vezbac?.napomena ?? ""}
              rows={3}
              className="text-base"
            />
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
