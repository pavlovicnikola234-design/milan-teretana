"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { sr } from "date-fns/locale"
import { formatDateSr } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createTrening } from "@/app/vezbaci/[id]/actions"

interface NoviTreningFormProps {
  vezbacId: string
}

export function NoviTreningForm({ vezbacId }: NoviTreningFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!date) return
    setLoading(true)

    try {
      const isoDate = format(date, "yyyy-MM-dd")
      await createTrening(vezbacId, isoDate)
      router.push(`/vezbaci/${vezbacId}/trening/${isoDate}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Greska pri kreiranju treninga.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={<Button variant="outline" className="flex-1 justify-start gap-2 text-base h-11" />}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? formatDateSr(date, "d. MMMM yyyy.") : "Izaberi datum"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d)
              setOpen(false)
            }}
            locale={sr}
          />
        </PopoverContent>
      </Popover>
      <Button
        onClick={handleCreate}
        disabled={!date || loading}
        className="h-11"
      >
        {loading ? "..." : "Kreiraj"}
      </Button>
    </div>
  )
}
