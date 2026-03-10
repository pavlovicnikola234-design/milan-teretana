export const dynamic = "force-dynamic"

import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
import { VezbacCard } from "@/components/vezbac-card"
import { VezbaciPageClient } from "./page-client"
import type { Vezbac } from "@/lib/types"

export default async function VezbaciPage() {
  const supabase = createSupabaseClient()
  const { data: vezbaci } = await supabase
    .from("vezbaci")
    .select("*")
    .order("ime", { ascending: true })

  return (
    <>
      <Header title="Moji Vezbaci" />
      <main className="p-4 max-w-2xl mx-auto">
        <VezbaciPageClient>
          {vezbaci && vezbaci.length > 0 ? (
            <div className="space-y-3">
              {(vezbaci as Vezbac[]).map((v) => (
                <VezbacCard key={v.id} vezbac={v} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Nema vezbaca</p>
              <p className="text-sm mt-1">
                Dodajte prvog vezbaca klikom na dugme ispod
              </p>
            </div>
          )}
        </VezbaciPageClient>
      </main>
    </>
  )
}
