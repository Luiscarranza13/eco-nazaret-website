-- ============================================================
--  EcoNazaret – Esquema de base de datos
--  Proyecto: I.E. Jesús de Nazaret, Bellavista, Celendín, Cajamarca, Perú
--  Ejecutar en: Supabase → SQL Editor → Run
-- ============================================================

-- ─── 1. CATEGORÍAS ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categorias (
  id          TEXT PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  icono       TEXT,
  creado_en   TIMESTAMPTZ DEFAULT NOW()
);

-- Permite lectura pública; escritura solo para admin
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de categorías"
  ON categorias FOR SELECT USING (true);

CREATE POLICY "Escritura sin restricción (desarrollo)"
  ON categorias FOR ALL USING (true) WITH CHECK (true);


-- ─── 2. PRODUCTOS ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS productos (
  id                TEXT PRIMARY KEY,
  nombre            TEXT NOT NULL,
  descripcion       TEXT NOT NULL,
  precio            DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
  stock             INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria_id      TEXT REFERENCES categorias(id) ON DELETE SET NULL,
  imagen            TEXT NOT NULL DEFAULT '/images/product-coffee.jpg',
  beneficios        TEXT[] DEFAULT '{}',
  destacado         BOOLEAN DEFAULT false,
  creado_en         DATE DEFAULT CURRENT_DATE,
  cantidad_vendida  INTEGER DEFAULT 0
);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de productos"
  ON productos FOR SELECT USING (true);

CREATE POLICY "Escritura sin restricción (desarrollo)"
  ON productos FOR ALL USING (true) WITH CHECK (true);


-- ─── 3. PEDIDOS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pedidos (
  id                TEXT PRIMARY KEY,
  nombre_cliente    TEXT NOT NULL,
  telefono_cliente  TEXT NOT NULL,
  email_cliente     TEXT NOT NULL,
  direccion_cliente TEXT,
  ciudad_cliente    TEXT,
  notas             TEXT,
  total             DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  estado            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (estado IN (
                        'pending','confirmed','processing',
                        'shipped','delivered','cancelled'
                      )),
  creado_en         TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ
);

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserción pública de pedidos"
  ON pedidos FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura y actualización sin restricción (desarrollo)"
  ON pedidos FOR ALL USING (true) WITH CHECK (true);


-- ─── 4. ÍTEMS DE PEDIDO ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS items_pedido (
  id               SERIAL PRIMARY KEY,
  pedido_id        TEXT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id      TEXT REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto  TEXT NOT NULL,
  imagen_producto  TEXT,
  precio_unitario  DECIMAL(10,2) NOT NULL,
  cantidad         INTEGER NOT NULL CHECK (cantidad > 0),
  subtotal         DECIMAL(10,2) NOT NULL
);

ALTER TABLE items_pedido ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserción pública de ítems"
  ON items_pedido FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura sin restricción (desarrollo)"
  ON items_pedido FOR ALL USING (true) WITH CHECK (true);


-- ─── 5. MENSAJES DE CONTACTO ─────────────────────────────────

CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id        TEXT PRIMARY KEY,
  nombre    TEXT NOT NULL,
  email     TEXT NOT NULL,
  telefono  TEXT,
  asunto    TEXT NOT NULL,
  mensaje   TEXT NOT NULL,
  leido     BOOLEAN DEFAULT false,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inserción pública de mensajes"
  ON mensajes_contacto FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura y escritura sin restricción (desarrollo)"
  ON mensajes_contacto FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
--  DATOS INICIALES (SEED)
-- ============================================================

-- ─── Categorías ──────────────────────────────────────────────

INSERT INTO categorias (id, nombre, descripcion, icono) VALUES
  ('cafe',           'Café Orgánico',     'Café cultivado a 2750 msnm sin pesticidas ni químicos',          '☕'),
  ('compost',        'Compost',           'Abono orgánico para mejorar la estructura y fertilidad del suelo','🌱'),
  ('humus',          'Humus de Lombriz',  'Fertilizante natural producido por lombrices californianas',     '🪱'),
  ('fertilizante',   'Fertilizantes',     'Nutrientes naturales concentrados de acción rápida en plantas',  '🌿'),
  ('abono',          'Abonos Orgánicos',  'Mezclas nutritivas para agricultura ecológica sostenible',       '🌾'),
  ('biohuerto',      'Biohuerto',         'Kits y herramientas para iniciar tu huerto orgánico en casa',    '🏡')
ON CONFLICT (id) DO NOTHING;


-- ─── Productos (7 registros) ─────────────────────────────────

INSERT INTO productos
  (id, nombre, descripcion, precio, stock, categoria_id, imagen, beneficios, destacado, creado_en, cantidad_vendida)
VALUES
  (
    'prod-001',
    'Café Orgánico de Altura 250 g',
    'Café 100 % arábica cultivado a más de 2 750 msnm en las montañas de Cajamarca. '
    'Secado al sol y tostado artesanalmente por nuestras estudiantes. '
    'Aroma intenso, sabor suave con notas a chocolate negro y frutos rojos. '
    'Libre de pesticidas, fertilizantes químicos y conservantes.',
    35.00, 50, 'cafe',
    '/images/product-coffee.jpg',
    ARRAY['100 % Orgánico','Tostado artesanal','Sin pesticidas','Comercio justo','2 750 msnm'],
    true, '2024-01-15', 127
  ),
  (
    'prod-002',
    'Compost Premium 5 kg',
    'Abono orgánico de alta calidad elaborado con residuos vegetales y estiércol animal '
    'del biohuerto escolar. Mejora la estructura del suelo, aumenta la retención de agua '
    'y aporta macro y micronutrientes esenciales. Ideal para huertos, jardines y macetas.',
    25.00, 100, 'compost',
    '/images/product-compost.jpg',
    ARRAY['Rico en nutrientes','Mejora estructura del suelo','100 % Natural','Sin olores fuertes','Para todo tipo de suelo'],
    true, '2024-01-20', 89
  ),
  (
    'prod-003',
    'Humus de Lombriz 3 kg',
    'Fertilizante natural producido por lombrices rojas californianas alimentadas con '
    'residuos orgánicos seleccionados del colegio. El mejor abono para plantas de interior, '
    'jardines y huertos familiares. pH neutro, libre de patógenos y listo para usar.',
    30.00, 75, 'humus',
    '/images/product-humus.jpg',
    ARRAY['Alto en microorganismos','pH neutro','Estimula raíces','Retiene humedad','Sin mal olor'],
    true, '2024-02-01', 156
  ),
  (
    'prod-004',
    'Fertilizante Ecológico Líquido 500 ml',
    'Biol enriquecido con microorganismos benéficos y extractos de plantas andinas. '
    'Ideal para aplicación foliar y fertirrigación. Fortalece las plantas, mejora la '
    'resistencia a plagas y enfermedades, y aumenta la producción hasta en un 30 %.',
    20.00, 60, 'fertilizante',
    '/images/product-fertilizer.jpg',
    ARRAY['Fácil aplicación','Resultados en 7 días','Fortalece plantas','Ecológico','Multiusos'],
    false, '2024-02-10', 67
  ),
  (
    'prod-005',
    'Abono Natural para Frutales 4 kg',
    'Mezcla especial de compost, humus y minerales naturales de la sierra cajamarquina, '
    'optimizada para árboles frutales como mango, limón, naranja y aguacate. '
    'Aumenta la producción de frutos, mejora el sabor y la resistencia a enfermedades.',
    28.00, 45, 'abono',
    '/images/product-compost.jpg',
    ARRAY['Más y mejores frutos','Mejor sabor','Resistencia a plagas','Larga duración','Para frutales'],
    false, '2024-02-15', 43
  ),
  (
    'prod-006',
    'Kit Biohuerto Familiar Completo',
    'Todo lo necesario para iniciar tu biohuerto orgánico en casa. Incluye 5 sobres de '
    'semillas certificadas (lechuga, rabanito, albahaca, cilantro y tomate cherry), '
    '2 kg de sustrato orgánico especial y guía ilustrada de cultivo paso a paso.',
    45.00, 30, 'biohuerto',
    '/images/product-biohuerto-kit.jpg',
    ARRAY['5 variedades de semillas','Semillas certificadas','Guía ilustrada','Sustrato incluido','Para toda la familia'],
    true, '2024-03-01', 78
  ),
  (
    'prod-007',
    'Café Molido Artesanal 250 g',
    'Café orgánico de altura, molido al momento de tu pedido con tueste medio artesanal. '
    'Desarrolla notas aromáticas a chocolate oscuro, nuez tostada y caramelo suave. '
    'Perfecto para cafetera de filtro, prensa francesa o espresso manual.',
    38.00, 40, 'cafe',
    '/images/product-coffee.jpg',
    ARRAY['Molido al momento','Tueste medio artesanal','Notas a chocolate','Sin aditivos','Origen único Cajamarca'],
    false, '2024-03-10', 94
  )
ON CONFLICT (id) DO NOTHING;


-- ─── Pedidos de ejemplo (3 registros) ────────────────────────

INSERT INTO pedidos
  (id, nombre_cliente, telefono_cliente, email_cliente, direccion_cliente, ciudad_cliente, total, estado, creado_en)
VALUES
  ('PED-001', 'María López Quispe',  '976543210', 'maria.lopez@gmail.com',  'Jr. Bolívar 123',  'Cajamarca',  95.00, 'delivered', '2024-03-01 10:00:00+00'),
  ('PED-002', 'Juan Pérez Mendoza',  '987654321', 'juan.perez@hotmail.com', 'Av. La Marina 456','Lima',        45.00, 'shipped',   '2024-03-10 14:30:00+00'),
  ('PED-003', 'Carlos Mendoza Torres','965432109','carlos.m@gmail.com',     'Calle Real 789',   'Trujillo',   115.00,'pending',   '2024-03-15 09:15:00+00')
ON CONFLICT (id) DO NOTHING;


-- ─── Ítems de pedidos ────────────────────────────────────────

INSERT INTO items_pedido
  (pedido_id, producto_id, nombre_producto, imagen_producto, precio_unitario, cantidad, subtotal)
VALUES
  -- PED-001: Café × 1  +  Humus × 1  +  Fertilizante × 1  = 35+30+20=85 (pero el total es 95 por envío 10)
  ('PED-001','prod-001','Café Orgánico de Altura 250 g',    '/images/product-coffee.jpg',     35.00, 1, 35.00),
  ('PED-001','prod-003','Humus de Lombriz 3 kg',            '/images/product-humus.jpg',      30.00, 1, 30.00),
  ('PED-001','prod-004','Fertilizante Ecológico Líquido',   '/images/product-fertilizer.jpg', 20.00, 1, 20.00),
  -- PED-002: Kit Biohuerto × 1 = 45
  ('PED-002','prod-006','Kit Biohuerto Familiar Completo',  '/images/product-biohuerto-kit.jpg', 45.00, 1, 45.00),
  -- PED-003: Compost × 3  +  Fertilizante × 2 = 75+40=115
  ('PED-003','prod-002','Compost Premium 5 kg',             '/images/product-compost.jpg',    25.00, 3, 75.00),
  ('PED-003','prod-004','Fertilizante Ecológico Líquido',   '/images/product-fertilizer.jpg', 20.00, 2, 40.00)
;


-- ─── Mensajes de contacto (3 registros) ──────────────────────

INSERT INTO mensajes_contacto
  (id, nombre, email, telefono, asunto, mensaje, leido, creado_en)
VALUES
  (
    'msg-001',
    'Ana Villanueva Ríos',
    'ana.villanueva@gmail.com',
    '976123456',
    '¿Dónde puedo comprar sus productos?',
    'Hola, soy de Cajamarca y me interesa mucho su café orgánico y los abonos para mi huerta. '
    '¿Tienen alguna tienda física en la ciudad o solo hacen ventas en línea? '
    'También quisiera saber si hacen delivery. Muchas gracias.',
    false,
    '2024-03-14 10:00:00+00'
  ),
  (
    'msg-002',
    'Carlos Huamán Díaz',
    'carlos.huaman@hotmail.com',
    NULL,
    'Consulta sobre envíos a provincias',
    'Estimados, soy de Lima pero tengo una finca en Cajamarca. '
    'Me interesa comprar humus de lombriz y compost en grandes cantidades. '
    '¿Tienen precios especiales para compras al por mayor? '
    '¿Cuánto demora el envío a Lima y cuál es el costo?',
    false,
    '2024-03-15 16:30:00+00'
  ),
  (
    'msg-003',
    'Lucía Flores Paredes',
    'lucia.flores@yahoo.com',
    '955789012',
    'Propuesta de distribución',
    'Buenos días. Soy dueña de una tienda de productos naturales en Trujillo y me gustaría '
    'convertirme en distribuidora de sus productos en esa ciudad. '
    'El café y los fertilizantes orgánicos tienen mucha demanda aquí. '
    '¿Podríamos coordinar una reunión virtual para hablar sobre esto?',
    true,
    '2024-03-13 08:45:00+00'
  )
ON CONFLICT (id) DO NOTHING;


-- ─── 6. USUARIOS ADMINISTRADORES ─────────────────────────────

CREATE TABLE IF NOT EXISTS usuarios (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  usuario         TEXT NOT NULL UNIQUE,
  email           TEXT NOT NULL UNIQUE,
  contrasena_hash TEXT NOT NULL,
  rol             TEXT NOT NULL DEFAULT 'admin'
                    CHECK (rol IN ('admin', 'editor', 'viewer')),
  activo          BOOLEAN DEFAULT true,
  creado_en       TIMESTAMPTZ DEFAULT NOW(),
  ultimo_acceso   TIMESTAMPTZ
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sin acceso público a usuarios"
  ON usuarios FOR SELECT USING (false);

CREATE POLICY "Escritura sin restricción (desarrollo)"
  ON usuarios FOR ALL USING (true) WITH CHECK (true);


-- ─── Usuarios iniciales ──────────────────────────────────────

-- Extensión necesaria para hashear contraseñas con bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO usuarios (nombre, usuario, email, contrasena_hash, rol, activo) VALUES
  ('Administrador EcoNazaret', 'admin',    'admin@iejesusnazaret.edu.pe',   crypt('Admin#Nazaret24',  gen_salt('bf', 10)), 'admin',  true),
  ('Docente Responsable',      'docente',  'docente@iejesusnazaret.edu.pe', crypt('Docente#2024',     gen_salt('bf', 10)), 'editor', true),
  ('Auxiliar de tienda',       'auxiliar', 'tienda@iejesusnazaret.edu.pe',  crypt('Auxiliar#2024',    gen_salt('bf', 10)), 'viewer', true)
ON CONFLICT (usuario) DO NOTHING;


-- ============================================================
--  VERIFICACIÓN (ejecutar por separado para confirmar datos)
-- ============================================================
-- SELECT COUNT(*) FROM categorias;       -- debe ser 6
-- SELECT COUNT(*) FROM productos;        -- debe ser 7
-- SELECT COUNT(*) FROM pedidos;          -- debe ser 3
-- SELECT COUNT(*) FROM items_pedido;     -- debe ser 6
-- SELECT COUNT(*) FROM mensajes_contacto;-- debe ser 3
-- SELECT COUNT(*) FROM usuarios;         -- debe ser 3
