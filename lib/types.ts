export interface Vezbac {
  id: string
  ime: string
  prezime: string
  telefon: string | null
  napomena: string | null
  share_token: string | null
  created_at: string
}

export interface Trening {
  id: string
  vezbac_id: string
  datum: string
  napomena: string | null
  zavrsen: boolean
  created_at: string
}

export interface Vezba {
  id: string
  trening_id: string
  redosled: number
  naziv: string
  serije: number
  ponavljanja: string
  kilaza: string | null
  pauza: string | null
  zavrsena: boolean
  created_at: string
}
