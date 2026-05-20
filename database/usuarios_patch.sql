-- ============================================================
--  EcoNazaret – Parche: tabla usuarios con contraseñas
--  Ejecutar en: Supabase → SQL Editor → Run
--  (Solo si ya ejecutaste schema.sql sin el campo contrasena_hash)
-- ============================================================

-- Habilitar pgcrypto para hashing bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── Agregar columna si no existe ───────────────────────────

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS contrasena_hash TEXT;


-- ─── Actualizar o insertar usuarios con contraseñas ──────────

-- Si los registros ya existen (de la versión anterior sin contraseña)
-- los actualizamos con su hash. Si no existen, los insertamos.

INSERT INTO usuarios (nombre, usuario, email, contrasena_hash, rol, activo)
VALUES
  (
    'Administrador EcoNazaret',
    'admin',
    'admin@iejesusnazaret.edu.pe',
    crypt('Admin#Nazaret24', gen_salt('bf', 10)),
    'admin',
    true
  ),
  (
    'Docente Responsable',
    'docente',
    'docente@iejesusnazaret.edu.pe',
    crypt('Docente#2024', gen_salt('bf', 10)),
    'editor',
    true
  ),
  (
    'Auxiliar de tienda',
    'auxiliar',
    'tienda@iejesusnazaret.edu.pe',
    crypt('Auxiliar#2024', gen_salt('bf', 10)),
    'viewer',
    true
  )
ON CONFLICT (usuario) DO UPDATE
  SET contrasena_hash = EXCLUDED.contrasena_hash,
      email           = EXCLUDED.email,
      nombre          = EXCLUDED.nombre;


-- ─── Hacer la columna obligatoria (después del seed) ────────

ALTER TABLE usuarios
  ALTER COLUMN contrasena_hash SET NOT NULL;


-- ─── Función auxiliar para verificar contraseñas ────────────
-- Uso: SELECT verificar_contrasena('admin', 'Admin#Nazaret24');
-- Devuelve: true / false

CREATE OR REPLACE FUNCTION verificar_contrasena(
  p_usuario TEXT,
  p_contrasena TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM usuarios
    WHERE usuario = p_usuario
      AND activo  = true
      AND contrasena_hash = crypt(p_contrasena, contrasena_hash)
  );
$$;


-- ─── Verificación ───────────────────────────────────────────
SELECT
  usuario,
  email,
  rol,
  activo,
  LENGTH(contrasena_hash) > 0 AS tiene_contrasena
FROM usuarios
ORDER BY rol;
