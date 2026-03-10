"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VezbacForm } from "@/components/vezbac-form"

interface VezbaciPageClientProps {
  children: React.ReactNode
}

export function VezbaciPageClient({ children }: VezbaciPageClientProps) {
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
      <VezbacForm open={formOpen} onOpenChange={setFormOpen} />
    </>
  )
}
