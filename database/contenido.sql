-- ============================================================
--  EcoNazaret – Galería, Testimonios y Storage
--  Proyecto: I.E. Jesús de Nazaret, Bellavista, Celendín
--  Ejecutar en: Supabase → SQL Editor → Run
-- ============================================================

-- ─── STORAGE: Bucket de imágenes ─────────────────────────────
-- Supabase crea el bucket via Dashboard > Storage > New bucket
-- (nombre: "imagenes", tipo: Public) O ejecuta esto:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imagenes', 'imagenes', true, 52428800,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
WHERE id = 'imagenes';

DROP POLICY IF EXISTS "Imágenes públicas lectura" ON storage.objects;
CREATE POLICY "Imágenes públicas lectura"
  ON storage.objects FOR SELECT USING (bucket_id = 'imagenes');

DROP POLICY IF EXISTS "Admin puede subir imágenes" ON storage.objects;
CREATE POLICY "Admin puede subir imágenes"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'imagenes');

DROP POLICY IF EXISTS "Admin puede actualizar imágenes" ON storage.objects;
CREATE POLICY "Admin puede actualizar imágenes"
  ON storage.objects FOR UPDATE USING (bucket_id = 'imagenes');

DROP POLICY IF EXISTS "Admin puede eliminar imágenes" ON storage.objects;
CREATE POLICY "Admin puede eliminar imágenes"
  ON storage.objects FOR DELETE USING (bucket_id = 'imagenes');


-- ─── TESTIMONIOS ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS testimonios (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre       TEXT NOT NULL,
  rol          TEXT NOT NULL,
  contenido    TEXT NOT NULL,
  calificacion INTEGER NOT NULL DEFAULT 5 CHECK (calificacion BETWEEN 1 AND 5),
  producto     TEXT,
  imagen       TEXT DEFAULT '/images/testimonial-1.jpg',
  activo       BOOLEAN DEFAULT true,
  creado_en    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de testimonios"
  ON testimonios FOR SELECT USING (true);

CREATE POLICY "Escritura sin restricción (desarrollo)"
  ON testimonios FOR ALL USING (true) WITH CHECK (true);


-- ─── GALERÍA ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS galeria (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  src       TEXT NOT NULL,
  alt       TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'General',
  orden     INTEGER DEFAULT 0,
  activo    BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de galería"
  ON galeria FOR SELECT USING (true);

CREATE POLICY "Escritura sin restricción (desarrollo)"
  ON galeria FOR ALL USING (true) WITH CHECK (true);


-- ─── Seed: Testimonios (3 registros) ─────────────────────────

INSERT INTO testimonios (id, nombre, rol, contenido, calificacion, producto, imagen, activo) VALUES
  (
    'test-001',
    'María Elena Quispe',
    'Agricultora, Celendín',
    'El compost de EcoNazaret transformó mi chacra. Mis cultivos nunca habían estado tan verdes y saludables. Además, es hermoso saber que apoyo a los estudiantes del colegio.',
    5, 'Compost Premium', '/images/testimonial-1.jpg', true
  ),
  (
    'test-002',
    'Carlos Mendoza',
    'Chef, Lima',
    'El café orgánico de Cajamarca tiene un sabor único, con notas de chocolate y cítricos. Lo uso en mi restaurante y mis clientes lo adoran.',
    5, 'Café Orgánico', '/images/testimonial-2.jpg', true
  ),
  (
    'test-003',
    'Ana Lucía Vargas',
    'Jardinera urbana, Trujillo',
    'El kit de biohuerto fue perfecto para iniciar con mis hijos. Las semillas germinaron rápido y ahora tenemos lechugas y tomates en casa. Una experiencia educativa increíble.',
    5, 'Kit Biohuerto', '/images/testimonial-3.jpg', true
  )
ON CONFLICT (id) DO NOTHING;


-- ─── Seed: Galería (6 registros) ─────────────────────────────

INSERT INTO galeria (id, src, alt, categoria, orden, activo) VALUES
  ('gal-001', '/images/gallery-1.jpg', 'Estudiantes trabajando en el biohuerto', 'Biohuerto', 1, true),
  ('gal-002', '/images/gallery-2.jpg', 'Granos de café orgánico de altura',      'Café',       2, true),
  ('gal-003', '/images/gallery-3.jpg', 'Proceso de compostaje escolar',           'Compost',    3, true),
  ('gal-004', '/images/gallery-4.jpg', 'Paisaje de Bellavista, Celendín',         'Cajamarca',  4, true),
  ('gal-005', '/images/gallery-5.jpg', 'Cultivos en terrazas andinas',            'Cultivos',   5, true),
  ('gal-006', '/images/gallery-6.jpg', 'Producción de humus de lombriz',          'Humus',      6, true)
ON CONFLICT (id) DO NOTHING;


-- ─── Verificación ───────────────────────────────────────────
-- SELECT COUNT(*) FROM testimonios;  -- debe ser 3
-- SELECT COUNT(*) FROM galeria;      -- debe ser 6


-- ─── CONFIGURACIÓN EDITABLE DEL SITIO ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS configuracion_sitio (
  clave          TEXT PRIMARY KEY,
  valor          TEXT NOT NULL DEFAULT '',
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE configuracion_sitio ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública de configuración del sitio" ON configuracion_sitio;
CREATE POLICY "Lectura pública de configuración del sitio"
  ON configuracion_sitio FOR SELECT USING (true);

DROP POLICY IF EXISTS "Escritura sin restricción (desarrollo)" ON configuracion_sitio;
CREATE POLICY "Escritura sin restricción (desarrollo)"
  ON configuracion_sitio FOR ALL USING (true) WITH CHECK (true);

INSERT INTO configuracion_sitio (clave, valor) VALUES
  ('businessName', 'EcoNazaret'),
  ('contactEmail', 'info@iejesusnazaret.edu.pe'),
  ('phone', '+51 976 123 456'),
  ('whatsapp', '976123456'),
  ('address', 'Bellavista, Celendín, Cajamarca, Perú'),
  ('heroBackgroundImage', '/images/hero-bg.jpg'),
  ('heroVideoUrl', '/videos/hero-background.mp4'),
  ('heroGifUrl', '/images/gallery-1.jpg'),
  ('aboutImage', '/images/about-students.jpg'),
  ('heroBadge', 'Educación y Agricultura Sostenible · Cajamarca, Perú'),
  ('heroTitleAccent', 'jóvenes líderes'),
  ('heroTitleRest', 'para el futuro'),
  ('heroSubtitle1', 'Productos ecológicos elaborados con amor por los estudiantes de la I.E. Jesús de Nazaret.'),
  ('heroSubtitle2', 'Educación integral, valores cristianos y conciencia ambiental desde Bellavista, Celendín.'),
  ('heroSubtitle3', 'Cultivando el futuro con manos jóvenes y corazones verdes.')
ON CONFLICT (clave) DO NOTHING;
