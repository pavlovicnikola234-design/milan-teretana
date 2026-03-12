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
import { saveAsTemplate } from "@/app/vezbaci/[id]/template-actions"

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vezbacId: string
  treningId: string
  datum: string
}

export function SaveTemplateDialog({
  open,
  onOpenChange,
  vezbacId,
  treningId,
  datum,
}: SaveTemplateDialogProps) {
  const [naziv, setNaziv] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!naziv.trim()) return
    setLoading(true)
    try {
      await saveAsTemplate(vezbacId, treningId, datum, naziv.trim())
      setNaziv("")
      onOpenChange(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Greska pri cuvanju sablona.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sacuvaj kao sablon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sablon-naziv">Naziv sablona</Label>
            <Input
              id="sablon-naziv"
              value={naziv}
              onChange={(e) => setNaziv(e.target.value)}
              placeholder="npr. Push dan"
              className="text-base"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Otkazi
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!naziv.trim() || loading}
            >
              {loading ? "Cuvam..." : "Sacuvaj"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
