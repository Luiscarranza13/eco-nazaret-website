import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  loginUsuario,
  createProducto,
  updateProducto,
  deleteProducto,
  createPedido,
  updateEstadoPedido,
  marcarMensajeLeido,
  deleteMensaje as deleteMensajeDB,
  createTestimonio,
  updateTestimonio,
  deleteTestimonio as deleteTestimonioDB,
  createGaleriaItem,
  updateGaleriaItem,
  deleteGaleriaItem as deleteGaleriaItemDB,
  updateConfiguracionSitio,
} from './supabase-service'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
  benefits: string[]
  featured?: boolean
  createdAt?: string
  soldCount?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  customerName: string
  customerPhone: string
  customerEmail: string
  customerAddress?: string
  customerCity?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  product?: string
  image: string
  active: boolean
  createdAt: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  category: string
  order: number
  active: boolean
  createdAt: string
}

export interface SiteConfig {
  businessName: string
  contactEmail: string
  phone: string
  whatsapp: string
  address: string
  heroBackgroundImage: string
  heroVideoUrl: string
  heroGifUrl: string
  aboutImage: string
  heroBadge: string
  heroTitleAccent: string
  heroTitleRest: string
  heroSubtitle1: string
  heroSubtitle2: string
  heroSubtitle3: string
}

export const defaultSiteConfig: SiteConfig = {
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

// ─── Sample Products Data ────────────────────────────────────────────────────

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Café Orgánico de Altura',
    description: 'Café 100% arábica cultivado a más de 2,750 msnm en las montañas de Cajamarca. Secado al sol y tostado artesanalmente por nuestros estudiantes.',
    price: 35.00,
    stock: 50,
    category: 'cafe',
    image: '/images/product-coffee.jpg',
    benefits: ['100% Orgánico', 'Tostado artesanal', 'Libre de químicos', 'Comercio justo'],
    featured: true,
    createdAt: '2024-01-15',
    soldCount: 127
  },
  {
    id: '2',
    name: 'Compost Premium',
    description: 'Abono orgánico de alta calidad elaborado con residuos vegetales y estiércol animal. Perfecto para huertos y jardines.',
    price: 25.00,
    stock: 100,
    category: 'compost',
    image: '/images/product-compost.jpg',
    benefits: ['Rico en nutrientes', 'Mejora estructura del suelo', '100% Natural', 'Sin olores'],
    featured: true,
    createdAt: '2024-01-20',
    soldCount: 89
  },
  {
    id: '3',
    name: 'Humus de Lombriz',
    description: 'Humus producido por lombrices rojas californianas alimentadas con residuos orgánicos seleccionados. El mejor fertilizante natural.',
    price: 30.00,
    stock: 75,
    category: 'humus',
    image: '/images/product-humus.jpg',
    benefits: ['Alto en microorganismos', 'pH neutro', 'Estimula raíces', 'Retiene humedad'],
    featured: true,
    createdAt: '2024-02-01',
    soldCount: 156
  },
  {
    id: '4',
    name: 'Fertilizante Ecológico Líquido',
    description: 'Biol enriquecido con microorganismos benéficos. Ideal para aplicación foliar y fertirrigación.',
    price: 20.00,
    stock: 60,
    category: 'fertilizante',
    image: '/images/product-fertilizer.jpg',
    benefits: ['Fácil aplicación', 'Resultados rápidos', 'Fortalece plantas', 'Ecológico'],
    createdAt: '2024-02-10',
    soldCount: 67
  },
  {
    id: '5',
    name: 'Abono Natural para Frutales',
    description: 'Mezcla especial de compost, humus y minerales naturales optimizada para árboles frutales.',
    price: 28.00,
    stock: 45,
    category: 'abono',
    image: '/images/product-compost.jpg',
    benefits: ['Más frutos', 'Mejor sabor', 'Resistencia a plagas', 'Larga duración'],
    createdAt: '2024-02-15',
    soldCount: 43
  },
  {
    id: '6',
    name: 'Kit Biohuerto Familiar',
    description: 'Todo lo necesario para iniciar tu biohuerto en casa: semillas, sustrato orgánico y guía de cultivo.',
    price: 45.00,
    stock: 30,
    category: 'biohuerto',
    image: '/images/product-biohuerto-kit.jpg',
    benefits: ['Fácil inicio', 'Semillas certificadas', 'Guía incluida', 'Para toda la familia'],
    featured: true,
    createdAt: '2024-03-01',
    soldCount: 78
  },
  {
    id: '7',
    name: 'Café Molido Especial',
    description: 'Café finamente molido, listo para preparar. Notas de chocolate y cítricos con final suave.',
    price: 38.00,
    stock: 40,
    category: 'cafe',
    image: '/images/product-coffee.jpg',
    benefits: ['Aroma intenso', 'Molido fino', 'Origen único', 'Frescura garantizada'],
    createdAt: '2024-03-10',
    soldCount: 94
  },
  {
    id: '8',
    name: 'Compost para Hortalizas',
    description: 'Compost enriquecido especialmente formulado para el cultivo de hortalizas de hoja y raíz.',
    price: 22.00,
    stock: 80,
    category: 'compost',
    image: '/images/product-compost.jpg',
    benefits: ['Óptimo para verduras', 'Rico en potasio', 'Textura ideal', 'Rinde más'],
    createdAt: '2024-03-15',
    soldCount: 112
  }
]

export const categories = [
  { id: 'all', name: 'Todos', icon: 'Package' },
  { id: 'cafe', name: 'Café Orgánico', icon: 'Coffee' },
  { id: 'compost', name: 'Compost', icon: 'Leaf' },
  { id: 'humus', name: 'Humus', icon: 'Sprout' },
  { id: 'fertilizante', name: 'Fertilizantes', icon: 'Droplets' },
  { id: 'abono', name: 'Abonos', icon: 'Trees' },
  { id: 'biohuerto', name: 'Biohuerto', icon: 'Flower2' }
]

// ─── Sample Testimonials ─────────────────────────────────────────────────────

const sampleTestimonials: Testimonial[] = [
  {
    id: 'test-001',
    name: 'María Elena Quispe',
    role: 'Agricultora, Celendín',
    content: 'El compost de EcoNazaret transformó mi chacra. Mis cultivos nunca habían estado tan verdes y saludables. Además, es hermoso saber que apoyo a los estudiantes del colegio.',
    rating: 5,
    product: 'Compost Premium',
    image: '/images/testimonial-1.jpg',
    active: true,
    createdAt: '2024-03-14',
  },
  {
    id: 'test-002',
    name: 'Carlos Mendoza',
    role: 'Chef, Lima',
    content: 'El café orgánico de Cajamarca tiene un sabor único, con notas de chocolate y cítricos que solo se encuentran en los Andes. Lo uso en mi restaurante y mis clientes lo adoran.',
    rating: 5,
    product: 'Café Orgánico',
    image: '/images/testimonial-2.jpg',
    active: true,
    createdAt: '2024-03-12',
  },
  {
    id: 'test-003',
    name: 'Ana Lucía Vargas',
    role: 'Jardinera urbana, Trujillo',
    content: 'El kit de biohuerto fue perfecto para iniciar con mis hijos. Las semillas germinaron rápido y ahora tenemos lechugas y tomates en casa. Una experiencia educativa increíble.',
    rating: 5,
    product: 'Kit Biohuerto',
    image: '/images/testimonial-3.jpg',
    active: true,
    createdAt: '2024-03-10',
  },
]

// ─── Sample Gallery ──────────────────────────────────────────────────────────

const sampleGallery: GalleryItem[] = [
  { id: 'gal-001', src: '/images/gallery-1.jpg', alt: 'Estudiantes trabajando en el biohuerto', category: 'Biohuerto', order: 1, active: true, createdAt: '2024-01-01' },
  { id: 'gal-002', src: '/images/gallery-2.jpg', alt: 'Granos de café orgánico de altura', category: 'Café', order: 2, active: true, createdAt: '2024-01-01' },
  { id: 'gal-003', src: '/images/gallery-3.jpg', alt: 'Proceso de compostaje escolar', category: 'Compost', order: 3, active: true, createdAt: '2024-01-01' },
  { id: 'gal-004', src: '/images/gallery-4.jpg', alt: 'Paisaje de Bellavista, Celendín', category: 'Cajamarca', order: 4, active: true, createdAt: '2024-01-01' },
  { id: 'gal-005', src: '/images/gallery-5.jpg', alt: 'Cultivos en terrazas andinas', category: 'Cultivos', order: 5, active: true, createdAt: '2024-01-01' },
  { id: 'gal-006', src: '/images/gallery-6.jpg', alt: 'Producción de humus de lombriz', category: 'Humus', order: 6, active: true, createdAt: '2024-01-01' },
]

// ─── Sample Orders ───────────────────────────────────────────────────────────

const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { product: sampleProducts[0], quantity: 2 },
      { product: sampleProducts[2], quantity: 1 }
    ],
    total: 100.00,
    customerName: 'Juan Pérez',
    customerPhone: '976543210',
    customerEmail: 'juan@email.com',
    customerAddress: 'Jr. Lima 123',
    customerCity: 'Cajamarca',
    status: 'delivered',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'ORD-002',
    items: [
      { product: sampleProducts[5], quantity: 1 }
    ],
    total: 45.00,
    customerName: 'María García',
    customerPhone: '987654321',
    customerEmail: 'maria@email.com',
    customerAddress: 'Av. Pardo 456',
    customerCity: 'Lima',
    status: 'shipped',
    createdAt: '2024-03-10T14:30:00Z',
  },
  {
    id: 'ORD-003',
    items: [
      { product: sampleProducts[1], quantity: 3 },
      { product: sampleProducts[3], quantity: 2 }
    ],
    total: 115.00,
    customerName: 'Carlos Mendoza',
    customerPhone: '965432109',
    customerEmail: 'carlos@email.com',
    customerAddress: 'Calle Real 789',
    customerCity: 'Trujillo',
    status: 'pending',
    createdAt: '2024-03-15T09:15:00Z',
  }
]

// ─── Sample Messages ─────────────────────────────────────────────────────────

const sampleMessages: ContactMessage[] = [
  {
    id: 'MSG-001',
    name: 'Ana López',
    email: 'ana@email.com',
    phone: '954321098',
    subject: 'Consulta sobre envíos',
    message: 'Hola, quisiera saber si hacen envíos a Chiclayo y cuánto cuesta.',
    read: false,
    createdAt: '2024-03-14T16:20:00Z'
  },
  {
    id: 'MSG-002',
    name: 'Pedro Ruiz',
    email: 'pedro@email.com',
    subject: 'Pedido mayorista',
    message: 'Estoy interesado en comprar café al por mayor para mi restaurante.',
    read: true,
    createdAt: '2024-03-12T11:45:00Z'
  }
]

// ─── Cart Store ──────────────────────────────────────────────────────────────

interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                : item
            )
          })
        } else {
          set({ items: [...items, { product, quantity: 1 }] })
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.product.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
        } else {
          set({
            items: get().items.map(item =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item
            )
          })
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      getItemCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
    }),
    { name: 'econazaret-cart' }
  )
)

// ─── Products Store ──────────────────────────────────────────────────────────

interface ProductsStore {
  products: Product[]
  orders: Order[]
  messages: ContactMessage[]
  testimonials: Testimonial[]
  gallery: GalleryItem[]
  siteConfig: SiteConfig
  dbLoaded: boolean
  setProducts: (products: Product[]) => void
  setAllData: (
    products: Product[],
    orders: Order[],
    messages: ContactMessage[],
    testimonials?: Testimonial[],
    gallery?: GalleryItem[],
    siteConfig?: SiteConfig
  ) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (id: string, status: Order['status']) => void
  addMessage: (message: ContactMessage) => void
  markMessageRead: (id: string) => void
  deleteMessage: (id: string) => void
  addTestimonial: (t: Testimonial) => void
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void
  addGalleryItem: (item: GalleryItem) => void
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void
  deleteGalleryItem: (id: string) => void
  updateSiteConfig: (updates: Partial<SiteConfig>) => void
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      orders: sampleOrders,
      messages: sampleMessages,
      testimonials: sampleTestimonials,
      gallery: sampleGallery,
      siteConfig: defaultSiteConfig,
      dbLoaded: false,

      setProducts: (products) => set({ products }),

      setAllData: (products, orders, messages, testimonials, gallery, siteConfig) =>
        set({
          products,
          orders,
          messages,
          ...(testimonials ? { testimonials } : {}),
          ...(gallery ? { gallery } : {}),
          ...(siteConfig ? { siteConfig: { ...defaultSiteConfig, ...siteConfig } } : {}),
          dbLoaded: true,
        }),

      addProduct: (product) => {
        set({ products: [...get().products, product] })
        createProducto(product).catch(console.error)
      },

      updateProduct: (id, updates) => {
        set({ products: get().products.map((p) => (p.id === id ? { ...p, ...updates } : p)) })
        updateProducto(id, updates).catch(console.error)
      },

      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) })
        deleteProducto(id).catch(console.error)
      },

      addOrder: (order) => {
        set({ orders: [order, ...get().orders] })
        createPedido(order).catch(console.error)
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o
          ),
        })
        updateEstadoPedido(id, status).catch(console.error)
      },

      addMessage: (message) => set({ messages: [message, ...get().messages] }),

      markMessageRead: (id) => {
        set({ messages: get().messages.map((m) => (m.id === id ? { ...m, read: true } : m)) })
        marcarMensajeLeido(id).catch(console.error)
      },

      deleteMessage: (id) => {
        set({ messages: get().messages.filter((m) => m.id !== id) })
        deleteMensajeDB(id).catch(console.error)
      },

      addTestimonial: (t) => {
        set({ testimonials: [t, ...get().testimonials] })
        createTestimonio(t).catch(console.error)
      },

      updateTestimonial: (id, updates) => {
        set({
          testimonials: get().testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })
        updateTestimonio(id, updates).catch(console.error)
      },

      deleteTestimonial: (id) => {
        set({ testimonials: get().testimonials.filter((t) => t.id !== id) })
        deleteTestimonioDB(id).catch(console.error)
      },

      addGalleryItem: (item) => {
        set({ gallery: [...get().gallery, item].sort((a, b) => a.order - b.order) })
        createGaleriaItem(item).catch(console.error)
      },

      updateGalleryItem: (id, updates) => {
        set({
          gallery: get()
            .gallery.map((g) => (g.id === id ? { ...g, ...updates } : g))
            .sort((a, b) => a.order - b.order),
        })
        updateGaleriaItem(id, updates).catch(console.error)
      },

      deleteGalleryItem: (id) => {
        set({ gallery: get().gallery.filter((g) => g.id !== id) })
        deleteGaleriaItemDB(id).catch(console.error)
      },

      updateSiteConfig: (updates) => {
        const nextConfig = { ...get().siteConfig, ...updates }
        set({ siteConfig: nextConfig })
        updateConfiguracionSitio(nextConfig).catch(console.error)
      },
    }),
    { name: 'econazaret-products' }
  )
)

// ─── Auth Store ──────────────────────────────────────────────────────────────

interface AuthStore {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: async (username, password) => {
        try {
          const ok = await loginUsuario(username, password)
          if (ok) {
            set({ isAuthenticated: true, username })
            return true
          }
        } catch {
          // Fallback a credenciales locales si Supabase no está disponible
          if (username === 'admin' && password === 'nazaret2024') {
            set({ isAuthenticated: true, username })
            return true
          }
        }
        return false
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    { name: 'econazaret-auth' }
  )
)
