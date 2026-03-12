"use server"

import { createSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function addVezbac(formData: FormData) {
  const supabase = createSupabaseClient()

  const { error } = await supabase.from("vezbaci").insert({
    ime: formData.get("ime") as string,
    prezime: formData.get("prezime") as string,
    telefon: (formData.get("telefon") as string) || null,
    napomena: (formData.get("napomena") as string) || null,
    pol: (formData.get("pol") as string) || null,
    kilaza: (formData.get("kilaza") as string) || null,
    visina: (formData.get("visina") as string) || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath("/vezbaci")
}

export async function updateVezbac(id: string, formData: FormData) {
  const supabase = createSupabaseClient()

  const { error } = await supabase
    .from("vezbaci")
    .update({
      ime: formData.get("ime") as string,
      prezime: formData.get("prezime") as string,
      telefon: (formData.get("telefon") as string) || null,
      napomena: (formData.get("napomena") as string) || null,
      pol: (formData.get("pol") as string) || null,
      kilaza: (formData.get("kilaza") as string) || null,
      visina: (formData.get("visina") as string) || null,
    })
    .eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/vezbaci")
}

export async function deleteVezbac(id: string) {
  const supabase = createSupabaseClient()

  const { error } = await supabase.from("vezbaci").delete().eq("id", id)

  if (error) throw new Error(error.message)
  revalidatePath("/vezbaci")
}
