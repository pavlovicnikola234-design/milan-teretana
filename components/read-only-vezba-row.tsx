import { Badge } from "@/components/ui/badge"
import type { Vezba } from "@/lib/types"

interface ReadOnlyVezbaRowProps {
  vezba: Vezba
  index: number
}

export function ReadOnlyVezbaRow({ vezba, index }: ReadOnlyVezbaRowProps) {
  return (
    <div className={`rounded-lg border p-3 space-y-2 ${vezba.zavrsena ? "opacity-60" : ""}`}>
      <div className="min-w-0">
        <p className={`font-medium text-base ${vezba.zavrsena ? "line-through text-muted-foreground" : ""}`}>
          <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
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
      </div>
    </div>
  )
}
