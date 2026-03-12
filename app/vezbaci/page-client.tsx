"use client"

import { useState, useMemo } from "react"
import { Plus, Search, ArrowUpDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { VezbacCard } from "@/components/vezbac-card"
import { VezbacForm } from "@/components/vezbac-form"
import type { Vezbac } from "@/lib/types"

interface VezbaciPageClientProps {
  vezbaci: Vezbac[]
}

export function VezbaciPageClient({ vezbaci }: VezbaciPageClientProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"ime" | "datum">("ime")

  const filtered = useMemo(() => {
    let list = vezbaci

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (v) =>
          `${v.ime} ${v.prezime}`.toLowerCase().includes(q) ||
          `${v.prezime} ${v.ime}`.toLowerCase().includes(q)
      )
    }

    if (sortBy === "datum") {
      list = [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } else {
      list = [...list].sort((a, b) =>
        `${a.ime} ${a.prezime}`.localeCompare(`${b.ime} ${b.prezime}`, "sr")
      )
    }

    return list
  }, [vezbaci, searchQuery, sortBy])

  return (
    <>
      <div className="space-y-4 pb-24">
        {/* Stats Bar */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Vezbaci</p>
              <p className="text-xs text-muted-foreground">
                {vezbaci.length} {vezbaci.length === 1 ? "osoba" : "osoba"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            {sortBy === "ime" ? "A-Z" : "Najnoviji"}
          </Badge>
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pretrazi vezbace..."
              className="pl-9 h-10 text-base rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-ring"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 h-10 w-10 rounded-xl"
            onClick={() => setSortBy(sortBy === "ime" ? "datum" : "ime")}
            title={sortBy === "ime" ? "Sortirano po imenu" : "Sortirano po datumu"}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Search result count */}
        {searchQuery && (
          <p className="text-xs text-muted-foreground px-1">
            {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultata"}
          </p>
        )}

        {/* Client List */}
        {filtered.length > 0 ? (
          <div className="space-y-2.5">
            {filtered.map((v) => (
              <VezbacCard key={v.id} vezbac={v} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            {searchQuery ? (
              <div>
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-base font-medium">Nema rezultata</p>
                <p className="text-sm mt-1">
                  Pokusajte sa drugim pojmom pretrage
                </p>
              </div>
            ) : (
              <div>
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-base font-medium">Nema vezbaca</p>
                <p className="text-sm mt-1">
                  Dodajte prvog vezbaca klikom na + dugme
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      <VezbacForm open={formOpen} onOpenChange={setFormOpen} />
    </>
  )
}
