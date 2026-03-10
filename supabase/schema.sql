-- Vezbaci (Klijenti)
CREATE TABLE vezbaci (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ime TEXT NOT NULL,
  prezime TEXT NOT NULL,
  telefon TEXT,
  napomena TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Treninzi (Dnevni planovi vezbanja)
CREATE TABLE treninzi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vezbac_id UUID NOT NULL REFERENCES vezbaci(id) ON DELETE CASCADE,
  datum DATE NOT NULL,
  napomena TEXT,
  zavrsen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(vezbac_id, datum)
);

-- Vezbe (Pojedinacne vezbe u okviru treninga)
CREATE TABLE vezbe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trening_id UUID NOT NULL REFERENCES treninzi(id) ON DELETE CASCADE,
  redosled SMALLINT NOT NULL DEFAULT 0,
  naziv TEXT NOT NULL,
  serije SMALLINT NOT NULL,
  ponavljanja TEXT NOT NULL,
  kilaza TEXT,
  pauza TEXT,
  zavrsena BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indeksi za ceste upite
CREATE INDEX idx_treninzi_vezbac ON treninzi(vezbac_id);
CREATE INDEX idx_treninzi_datum ON treninzi(datum);
CREATE INDEX idx_vezbe_trening ON vezbe(trening_id);

-- RLS politike (dozvoli sve jer nema autentifikacije)
ALTER TABLE vezbaci ENABLE ROW LEVEL SECURITY;
ALTER TABLE treninzi ENABLE ROW LEVEL SECURITY;
ALTER TABLE vezbe ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON vezbaci FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON treninzi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON vezbe FOR ALL USING (true) WITH CHECK (true);
