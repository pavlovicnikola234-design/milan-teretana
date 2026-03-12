"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getSabloni, applyTemplate, deleteTemplate } from "@/app/vezbaci/[id]/template-actions"
import type { Sablon } from "@/app/vezbaci/[id]/template-actions"

interface ApplyTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vezbacId: string
  treningId: string
  datum: string
}

export function ApplyTemplateDialog({
  open,
  onOpenChange,
  vezbacId,
  treningId,
  datum,
}: ApplyTemplateDialogProps) {
  const [sabloni, setSabloni] = useState<Sablon[]>([])
  const [loading, setLoading] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getSabloni()
        .then(setSabloni)
        .finally(() => setLoading(false))
    }
  }, [open])

  async function handleApply(sablonId: string) {
    setApplying(sablonId)
    try {
      await applyTemplate(vezbacId, treningId, datum, sablonId)
      onOpenChange(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Greska pri primeni sablona.")
    } finally {
      setApplying(null)
    }
  }

  async function handleDelete(sablonId: string) {
    try {
      await deleteTemplate(sablonId)
      setSabloni((prev) => prev.filter((s) => s.id !== sablonId))
    } catch {
      alert("Greska pri brisanju sablona.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Primeni sablon</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p className="text-center text-muted-foreground py-4">Ucitavanje...</p>
        ) : sabloni.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            Nema sacuvanih sablona
          </p>
        ) : (
          <div className="space-y-3">
            {sabloni.map((sablon) => (
              <div
                key={sablon.id}
                className="rounded-lg border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{sablon.naziv}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(sablon.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {sablon.vezbe.map((v) => (
                    <Badge key={v.id} variant="secondary" className="text-xs">
                      {v.naziv}
                    </Badge>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleApply(sablon.id)}
                  disabled={applying === sablon.id}
                >
                  {applying === sablon.id ? "Primenjujem..." : "Primeni"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
