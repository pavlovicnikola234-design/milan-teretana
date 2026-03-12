"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RestTimer } from "@/components/rest-timer"
import { publicToggleVezba } from "@/app/plan/[token]/trening/[datum]/actions"
import { parsePauza } from "@/lib/parse-pauza"
import type { Vezba } from "@/lib/types"

interface PublicVezbaRowProps {
  vezba: Vezba
  token: string
  datum: string
  index: number
}

export function PublicVezbaRow({ vezba, token, datum, index }: PublicVezbaRowProps) {
  const [checked, setChecked] = useState(vezba.zavrsena)

  async function handleToggle(value: boolean) {
    setChecked(value)
    try {
      await publicToggleVezba(token, vezba.id, datum, value)
    } catch {
      setChecked(!value)
      alert("Greska pri azuriranju vezbe.")
    }
  }

  return (
    <Card size="sm" className={`transition-opacity ${checked ? "opacity-60" : ""}`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3 min-w-0">
          <Checkbox
            checked={checked}
            onCheckedChange={(val) => handleToggle(val === true)}
            className="mt-1 h-5 w-5"
          />
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-[0.94rem] leading-tight ${checked ? "line-through text-muted-foreground" : ""}`}>
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
      </CardContent>
    </Card>
  )
}
