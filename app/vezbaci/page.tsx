export const dynamic = "force-dynamic"

import { createSupabaseClient } from "@/lib/supabase"
import { Header } from "@/components/header"
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
      <Header title="Plan Treninga" showThemeToggle />
      <main className="px-4 pt-2 pb-4 max-w-2xl mx-auto">
        <VezbaciPageClient vezbaci={(vezbaci as Vezbac[]) || []} />
      </main>
    </>
  )
}
