"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { publicUpdateKomentar } from "@/app/plan/[token]/trening/[datum]/actions"

interface PublicKomentarFieldProps {
  token: string
  treningId: string
  datum: string
  initialValue: string
}

export function PublicKomentarField({
  token,
  treningId,
  datum,
  initialValue,
}: PublicKomentarFieldProps) {
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const hasChanges = value !== initialValue

  async function handleSave() {
    setSaving(true)
    try {
      await publicUpdateKomentar(token, treningId, datum, value)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      alert("Greska pri cuvanju komentara.")
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
        placeholder="Ostavite komentar treneru..."
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
            "Sacuvaj komentar"
          )}
        </Button>
      )}
    </div>
  )
}
