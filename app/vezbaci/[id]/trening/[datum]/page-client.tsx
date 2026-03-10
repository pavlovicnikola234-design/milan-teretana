"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VezbaForm } from "@/components/vezba-form"

interface TreningPageClientProps {
  vezbacId: string
  treningId: string
  datum: string
  children: React.ReactNode
}

export function TreningPageClient({
  vezbacId,
  treningId,
  datum,
  children,
}: TreningPageClientProps) {
  const [formOpen, setFormOpen] = useState(false)

  return (
    <>
      {children}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      <VezbaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        vezbacId={vezbacId}
        treningId={treningId}
        datum={datum}
      />
    </>
  )
}
