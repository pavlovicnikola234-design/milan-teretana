"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Copy, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { sr } from "date-fns/locale"
import { formatDateSr } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { VezbaForm } from "@/components/vezba-form"
import { duplicateTrening } from "@/app/vezbaci/[id]/actions"

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
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const [dupOpen, setDupOpen] = useState(false)
  const [dupDate, setDupDate] = useState<Date | undefined>(undefined)
  const [dupLoading, setDupLoading] = useState(false)
  const [dupError, setDupError] = useState("")

  async function handleDuplicate() {
    if (!dupDate) return
    setDupLoading(true)
    setDupError("")

    try {
      const isoDate = format(dupDate, "yyyy-MM-dd")
      await duplicateTrening(vezbacId, treningId, isoDate)
      setDupOpen(false)
      router.push(`/vezbaci/${vezbacId}/trening/${isoDate}`)
    } catch (err) {
      setDupError(err instanceof Error ? err.message : "Greska pri dupliranju.")
    } finally {
      setDupLoading(false)
    }
  }

  return (
    <>
      {children}

      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          size="lg"
          variant="outline"
          className="h-12 w-12 rounded-full shadow-lg bg-background"
          onClick={() => {
            setDupDate(undefined)
            setDupError("")
            setDupOpen(true)
          }}
        >
          <Copy className="h-5 w-5" />
        </Button>
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

      <Dialog open={dupOpen} onOpenChange={setDupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliraj trening</DialogTitle>
            <DialogDescription>
              Izaberite datum za novi trening. Sve vezbe ce biti kopirane.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={dupDate}
              onSelect={setDupDate}
              locale={sr}
            />
          </div>

          {dupDate && (
            <p className="text-sm text-center text-muted-foreground">
              <CalendarIcon className="inline h-3.5 w-3.5 mr-1" />
              {formatDateSr(dupDate, "EEEE, d. MMMM yyyy.")}
            </p>
          )}

          {dupError && (
            <p className="text-sm text-center text-destructive">{dupError}</p>
          )}

          <DialogFooter>
            <Button
              onClick={handleDuplicate}
              disabled={!dupDate || dupLoading}
              className="w-full sm:w-auto"
            >
              {dupLoading ? "Dupliranje..." : "Dupliraj"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
