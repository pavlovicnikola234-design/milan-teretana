"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateNapomena } from "@/app/vezbaci/[id]/trening/[datum]/actions"

interface NapomenaFieldProps {
  vezbacId: string
  treningId: string
  datum: string
  initialValue: string
}

export function NapomenaField({
  vezbacId,
  treningId,
  datum,
  initialValue,
}: NapomenaFieldProps) {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const hasChanges = value !== initialValue

  async function handleSave() {
    setSaving(true)
    try {
      await updateNapomena(vezbacId, treningId, datum, value)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert("Greska pri cuvanju napomene.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setSaved(false)
        }}
        placeholder="Napomena za ovaj trening..."
        rows={3}
        className="text-base"
      />
      {(hasChanges || saved) && (
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          size="sm"
          variant={saved ? "outline" : "default"}
          className="gap-1.5"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Sacuvano
            </>
          ) : saving ? (
            "Cuvam..."
          ) : (
            "Sacuvaj napomenu"
          )}
        </Button>
      )}
    </div>
  )
}
