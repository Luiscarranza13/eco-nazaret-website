/**
 * Supabase service layer
 * Mapea entre los tipos de la BD (español) y los tipos del store (inglés)
 */
import { supabase } from './supabase'
import type { Product, Order, ContactMessage, Testimonial, GalleryItem, SiteConfig } from './store'

const fallbackSiteConfig: SiteConfig = {
  businessName: 'EcoNazaret',
  contactEmail: 'info@iejesusnazaret.edu.pe',
  phone: '+51 976 123 456',
  whatsapp: '976123456',
  address: 'Bellavista, Celendín, Cajamarca, Perú',
  heroBackgroundImage: '/images/hero-bg.jpg',
  heroVideoUrl: '/videos/hero-background.mp4',
  heroGifUrl: '/images/gallery-1.jpg',
  aboutImage: '/images/about-students.jpg',
  heroBadge: 'Educación y Agricultura Sostenible · Cajamarca, Perú',
  heroTitleAccent: 'jóvenes líderes',
  heroTitleRest: 'para el futuro',
  heroSubtitle1: 'Productos ecológicos elaborados con amor por los estudiantes de la I.E. Jesús de Nazaret.',
  heroSubtitle2: 'Educación integral, valores cristianos y conciencia ambiental desde Bellavista, Celendín.',
  heroSubtitle3: 'Cultivando el futuro con manos jóvenes y corazones verdes.',
}

// ─── Mapping helpers ────────────────────────────────────────────────────────

function mapProductoFromDB(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.nombre as string,
    description: row.descripcion as string,
    price: Number(row.precio),
    stock: Number(row.stock),
    category: (row.categoria_id as string) ?? '',
    image: (row.imagen as string) ?? '/images/product-coffee.jpg',
    benefits: (row.beneficios as string[]) ?? [],
    featured: Boolean(row.destacado),
    createdAt: (row.creado_en as string) ?? '',
    soldCount: Number(row.cantidad_vendida ?? 0),
  }
}

function mapProductoToDB(product: Partial<Product>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (product.id !== undefined) row.id = product.id
  if (product.name !== undefined) row.nombre = product.name
  if (product.description !== undefined) row.descripcion = product.description
  if (product.price !== undefined) row.precio = product.price
  if (product.stock !== undefined) row.stock = product.stock
  if (product.category !== undefined) row.categoria_id = product.category
  if (product.image !== undefined) row.imagen = product.image
  if (product.benefits !== undefined) row.beneficios = product.benefits
  if (product.featured !== undefined) row.destacado = product.featured
  if (product.createdAt !== undefined) row.creado_en = product.createdAt
  if (product.soldCount !== undefined) row.cantidad_vendida = product.soldCount
  return row
}

function mapPedidoFromDB(
  order: Record<string, unknown>,
  items: Record<string, unknown>[]
): Order {
  return {
    id: order.id as string,
    customerName: order.nombre_cliente as string,
    customerPhone: order.telefono_cliente as string,
    customerEmail: order.email_cliente as string,
    customerAddress: (order.direccion_cliente as string) ?? undefined,
    customerCity: (order.ciudad_cliente as string) ?? undefined,
    notes: (order.notas as string) ?? undefined,
    total: Number(order.total),
    status: order.estado as Order['status'],
    createdAt: order.creado_en as string,
    updatedAt: (order.actualizado_en as string) ?? undefined,
    items: items
      .filter((item) => item.pedido_id === order.id)
      .map((item) => ({
        quantity: Number(item.cantidad),
        product: {
          id: (item.producto_id as string) ?? '',
          name: item.nombre_producto as string,
          image: (item.imagen_producto as string) ?? '/images/product-coffee.jpg',
          price: Number(item.precio_unitario),
          description: '',
          stock: 0,
          category: '',
          benefits: [],
          featured: false,
          createdAt: '',
          soldCount: 0,
        },
      })),
  }
}

function mapMensajeFromDB(row: Record<string, unknown>): ContactMessage {
  return {
    id: row.id as string,
    name: row.nombre as string,
    email: row.email as string,
    phone: (row.telefono as string) ?? undefined,
    subject: row.asunto as string,
    message: row.mensaje as string,
    read: Boolean(row.leido),
    createdAt: row.creado_en as string,
  }
}

function mapTestimonioFromDB(row: Record<string, unknown>): Testimonial {
  return {
    id: row.id as string,
    name: row.nombre as string,
    role: row.rol as string,
    content: row.contenido as string,
    rating: Number(row.calificacion ?? 5),
    product: (row.producto as string) ?? undefined,
    image: (row.imagen as string) ?? '/images/testimonial-1.jpg',
    active: Boolean(row.activo),
    createdAt: (row.creado_en as string) ?? '',
  }
}

function mapGaleriaFromDB(row: Record<string, unknown>): GalleryItem {
  return {
    id: row.id as string,
    src: row.src as string,
    alt: row.alt as string,
    category: row.categoria as string,
    order: Number(row.orden ?? 0),
    active: Boolean(row.activo),
    createdAt: (row.creado_en as string) ?? '',
  }
}

function mapConfiguracionFromDB(rows: Record<string, unknown>[]): SiteConfig {
  const values = rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.clave as string] = (row.valor as string) ?? ''
    return acc
  }, {})

  return {
    businessName: values.businessName ?? fallbackSiteConfig.businessName,
    contactEmail: values.contactEmail ?? fallbackSiteConfig.contactEmail,
    phone: values.phone ?? fallbackSiteConfig.phone,
    whatsapp: values.whatsapp ?? fallbackSiteConfig.whatsapp,
    address: values.address ?? fallbackSiteConfig.address,
    heroBackgroundImage: values.heroBackgroundImage ?? fallbackSiteConfig.heroBackgroundImage,
    heroVideoUrl: values.heroVideoUrl ?? fallbackSiteConfig.heroVideoUrl,
    heroGifUrl: values.heroGifUrl ?? fallbackSiteConfig.heroGifUrl,
    aboutImage: values.aboutImage ?? fallbackSiteConfig.aboutImage,
    heroBadge: values.heroBadge ?? fallbackSiteConfig.heroBadge,
    heroTitleAccent: values.heroTitleAccent ?? fallbackSiteConfig.heroTitleAccent,
    heroTitleRest: values.heroTitleRest ?? fallbackSiteConfig.heroTitleRest,
    heroSubtitle1: values.heroSubtitle1 ?? fallbackSiteConfig.heroSubtitle1,
    heroSubtitle2: values.heroSubtitle2 ?? fallbackSiteConfig.heroSubtitle2,
    heroSubtitle3: values.heroSubtitle3 ?? fallbackSiteConfig.heroSubtitle3,
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUsuario(usuario: string, contrasena: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('verificar_contrasena', {
    p_usuario: usuario,
    p_contrasena: contrasena,
  })
  if (error) throw error
  return data === true
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProductos(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('creado_en', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapProductoFromDB)
}

export async function createProducto(product: Product): Promise<void> {
  const { error } = await supabase.from('productos').insert(mapProductoToDB(product))
  if (error) throw error
}

export async function updateProducto(id: string, updates: Partial<Product>): Promise<void> {
  const { error } = await supabase
    .from('productos')
    .update(mapProductoToDB(updates))
    .eq('id', id)
  if (error) throw error
}

export async function deleteProducto(id: string): Promise<void> {
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw error
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function fetchPedidos(): Promise<Order[]> {
  const [{ data: orders, error: oErr }, { data: items, error: iErr }] = await Promise.all([
    supabase.from('pedidos').select('*').order('creado_en', { ascending: false }),
    supabase.from('items_pedido').select('*'),
  ])
  if (oErr) throw oErr
  if (iErr) throw iErr
  return (orders ?? []).map((o) => mapPedidoFromDB(o, items ?? []))
}

export async function createPedido(order: Order): Promise<void> {
  const { error: oErr } = await supabase.from('pedidos').insert({
    id: order.id,
    nombre_cliente: order.customerName,
    telefono_cliente: order.customerPhone,
    email_cliente: order.customerEmail,
    direccion_cliente: order.customerAddress ?? null,
    ciudad_cliente: order.customerCity ?? null,
    notas: order.notes ?? null,
    total: order.total,
    estado: order.status,
  })
  if (oErr) throw oErr

  if (order.items.length > 0) {
    const { error: iErr } = await supabase.from('items_pedido').insert(
      order.items.map((item) => ({
        pedido_id: order.id,
        producto_id: item.product.id,
        nombre_producto: item.product.name,
        imagen_producto: item.product.image,
        precio_unitario: item.product.price,
        cantidad: item.quantity,
        subtotal: item.product.price * item.quantity,
      }))
    )
    if (iErr) throw iErr
  }
}

export async function updateEstadoPedido(id: string, estado: Order['status']): Promise<void> {
  const { error } = await supabase
    .from('pedidos')
    .update({ estado, actualizado_en: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export async function fetchMensajes(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('creado_en', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapMensajeFromDB)
}

export async function createMensaje(msg: {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}): Promise<void> {
  const { error } = await supabase.from('mensajes_contacto').insert({
    id: `msg-${Date.now()}`,
    ...msg,
    telefono: msg.telefono ?? null,
  })
  if (error) throw error
}

export async function marcarMensajeLeido(id: string): Promise<void> {
  const { error } = await supabase
    .from('mensajes_contacto')
    .update({ leido: true })
    .eq('id', id)
  if (error) throw error
}

export async function deleteMensaje(id: string): Promise<void> {
  const { error } = await supabase.from('mensajes_contacto').delete().eq('id', id)
  if (error) throw error
}

// ─── Testimonios ──────────────────────────────────────────────────────────────

export async function fetchTestimonios(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonios')
    .select('*')
    .order('creado_en', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapTestimonioFromDB)
}

export async function createTestimonio(t: Testimonial): Promise<void> {
  const { error } = await supabase.from('testimonios').insert({
    id: t.id,
    nombre: t.name,
    rol: t.role,
    contenido: t.content,
    calificacion: t.rating,
    producto: t.product ?? null,
    imagen: t.image,
    activo: t.active,
  })
  if (error) throw error
}

export async function updateTestimonio(id: string, updates: Partial<Testimonial>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (updates.name !== undefined) row.nombre = updates.name
  if (updates.role !== undefined) row.rol = updates.role
  if (updates.content !== undefined) row.contenido = updates.content
  if (updates.rating !== undefined) row.calificacion = updates.rating
  if (updates.product !== undefined) row.producto = updates.product
  if (updates.image !== undefined) row.imagen = updates.image
  if (updates.active !== undefined) row.activo = updates.active
  const { error } = await supabase.from('testimonios').update(row).eq('id', id)
  if (error) throw error
}

export async function deleteTestimonio(id: string): Promise<void> {
  const { error } = await supabase.from('testimonios').delete().eq('id', id)
  if (error) throw error
}

// ─── Galería ──────────────────────────────────────────────────────────────────

export async function fetchGaleria(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('galeria')
    .select('*')
    .order('orden', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapGaleriaFromDB)
}

export async function createGaleriaItem(item: GalleryItem): Promise<void> {
  const { error } = await supabase.from('galeria').insert({
    id: item.id,
    src: item.src,
    alt: item.alt,
    categoria: item.category,
    orden: item.order,
    activo: item.active,
  })
  if (error) throw error
}

export async function updateGaleriaItem(id: string, updates: Partial<GalleryItem>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (updates.src !== undefined) row.src = updates.src
  if (updates.alt !== undefined) row.alt = updates.alt
  if (updates.category !== undefined) row.categoria = updates.category
  if (updates.order !== undefined) row.orden = updates.order
  if (updates.active !== undefined) row.activo = updates.active
  const { error } = await supabase.from('galeria').update(row).eq('id', id)
  if (error) throw error
}

export async function deleteGaleriaItem(id: string): Promise<void> {
  const { error } = await supabase.from('galeria').delete().eq('id', id)
  if (error) throw error
}

// ─── Configuración editable del sitio ────────────────────────────────────────

export async function fetchConfiguracionSitio(): Promise<SiteConfig> {
  const { data, error } = await supabase.from('configuracion_sitio').select('*')
  if (error) throw error
  return mapConfiguracionFromDB(data ?? [])
}

export async function updateConfiguracionSitio(config: SiteConfig): Promise<void> {
  const rows = Object.entries(config).map(([clave, valor]) => ({
    clave,
    valor: valor ?? '',
    actualizado_en: new Date().toISOString(),
  }))

  const { error } = await supabase.from('configuracion_sitio').upsert(rows, {
    onConflict: 'clave',
  })
  if (error) throw error
}

// ─── Storage: subida de imágenes ─────────────────────────────────────────────

export async function uploadImagen(file: File, folder = 'general'): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from('imagenes').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from('imagenes').getPublicUrl(fileName)
  return data.publicUrl
}

export async function deleteImagen(publicUrl: string): Promise<void> {
  const url = new URL(publicUrl)
  const pathParts = url.pathname.split('/object/public/imagenes/')
  if (pathParts.length < 2) return
  const filePath = pathParts[1]
  const { error } = await supabase.storage.from('imagenes').remove([filePath])
  if (error) throw error
}

// ─── Fetch everything at once ─────────────────────────────────────────────────

export async function fetchAllData() {
  const [productos, pedidos, mensajes, testimonios, galeria, siteConfig] = await Promise.all([
    fetchProductos(),
    fetchPedidos(),
    fetchMensajes(),
    fetchTestimonios(),
    fetchGaleria(),
    fetchConfiguracionSitio().catch(() => fallbackSiteConfig),
  ])
  return { productos, pedidos, mensajes, testimonios, galeria, siteConfig }
}
