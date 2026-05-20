'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Mail,
  MailOpen,
  ChevronRight,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  Images,
  Quote,
  Upload,
  ToggleLeft,
  ToggleRight,
  Clapperboard,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  useAuthStore,
  useProductsStore,
  categories,
  type Product,
  type Order,
  type ContactMessage,
  type Testimonial,
  type GalleryItem,
  type SiteConfig,
} from '@/lib/store'
import { uploadImagen } from '@/lib/supabase-service'
import Swal from 'sweetalert2'

const swalTheme = Swal.mixin({
  customClass: {
    confirmButton: 'swal-btn-confirm',
    cancelButton: 'swal-btn-cancel',
    popup: 'swal-popup-custom',
    title: 'swal-title-custom',
  },
  buttonsStyling: false,
})

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', value: 'dashboard' },
  { icon: Package, label: 'Productos', value: 'products' },
  { icon: ShoppingCart, label: 'Pedidos', value: 'orders' },
  { icon: MessageSquare, label: 'Mensajes', value: 'messages' },
  { icon: Images, label: 'Galería', value: 'gallery' },
  { icon: Quote, label: 'Testimonios', value: 'testimonials' },
  { icon: Settings, label: 'Sitio', value: 'settings' },
]

const statusConfig: Record<
  Order['status'],
  { color: string; icon: typeof Clock; label: string }
> = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    label: 'Pendiente',
  },
  confirmed: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle2,
    label: 'Confirmado',
  },
  processing: {
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: RefreshCw,
    label: 'Procesando',
  },
  shipped: {
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck,
    label: 'Enviado',
  },
  delivered: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
    label: 'Entregado',
  },
  cancelled: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    label: 'Cancelado',
  },
}

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated, username, logout } = useAuthStore()
  const {
    products,
    orders,
    messages,
    testimonials,
    gallery,
    siteConfig,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    markMessageRead,
    deleteMessage,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    updateSiteConfig,
  } = useProductsStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [messageSearchQuery, setMessageSearchQuery] = useState('')
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: 'cafe',
    image: '',
    benefits: [],
    featured: false,
  })
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Galería state
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false)
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null)
  const [galleryForm, setGalleryForm] = useState({ src: '', alt: '', category: 'General', order: 0 })

  // Testimonios state
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [testimonialForm, setTestimonialForm] = useState({
    name: '', role: '', content: '', rating: 5, product: '', image: '/images/testimonial-1.jpg', active: true,
  })
  const [settingsForm, setSettingsForm] = useState<SiteConfig>(siteConfig)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    setSettingsForm(siteConfig)
  }, [siteConfig])

  if (!isAuthenticated) return null

  const handleLogout = async () => {
    const result = await swalTheme.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión como administrador.',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      logout()
      router.push('/admin')
    }
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedProduct) {
      updateProduct(selectedProduct.id, productForm)
      swalTheme.fire({
        icon: 'success',
        title: '¡Producto actualizado!',
        text: `"${productForm.name}" se actualizó correctamente.`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name || '',
        description: productForm.description || '',
        price: productForm.price || 0,
        stock: productForm.stock || 0,
        category: productForm.category || 'cafe',
        image: productForm.image || '/images/product-coffee.jpg',
        benefits: productForm.benefits || [],
        featured: productForm.featured || false,
        createdAt: new Date().toISOString().split('T')[0],
        soldCount: 0,
      }
      addProduct(newProduct)
      swalTheme.fire({
        icon: 'success',
        title: '¡Producto creado!',
        text: `"${newProduct.name}" se agregó al catálogo.`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }

    setIsProductDialogOpen(false)
    setSelectedProduct(null)
    resetProductForm()
  }

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: 'cafe',
      image: '',
      benefits: [],
      featured: false,
    })
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setProductForm(product)
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (product: Product) => {
    const result = await swalTheme.fire({
      icon: 'warning',
      title: '¿Eliminar producto?',
      html: `¿Seguro que deseas eliminar <strong>"${product.name}"</strong>?<br/>Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      deleteProduct(product.id)
      swalTheme.fire({
        icon: 'success',
        title: 'Producto eliminado',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  const handleDeleteMessage = async (message: ContactMessage) => {
    const result = await swalTheme.fire({
      icon: 'warning',
      title: '¿Eliminar mensaje?',
      text: `Se eliminará el mensaje de ${message.name}.`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })

    if (result.isConfirmed) {
      deleteMessage(message.id)
      setSelectedMessage(null)
      swalTheme.fire({
        icon: 'success',
        title: 'Mensaje eliminado',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  const handleOrderStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const label = statusConfig[newStatus].label
    updateOrderStatus(orderId, newStatus)
    swalTheme.fire({
      icon: 'success',
      title: 'Estado actualizado',
      text: `El pedido fue marcado como "${label}".`,
      timer: 1800,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  // â"€â"€â"€ Image upload helper â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const handleImageUpload = async (
    file: File,
    folder: string,
    onUrl: (url: string) => void
  ) => {
    setIsUploadingImage(true)
    try {
      const url = await uploadImagen(file, folder)
      onUrl(url)
    } catch {
      swalTheme.fire({ icon: 'error', title: 'Error al subir archivo', text: 'Verifica que el bucket "imagenes" exista en Supabase Storage y acepte este tipo de archivo.' })
    } finally {
      setIsUploadingImage(false)
    }
  }

  // â"€â"€â"€ Gallery handlers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedGalleryItem) {
      updateGalleryItem(selectedGalleryItem.id, { ...galleryForm })
      swalTheme.fire({ icon: 'success', title: 'Imagen actualizada', timer: 1800, timerProgressBar: true, showConfirmButton: false })
    } else {
      const item: GalleryItem = {
        id: `gal-${Date.now()}`,
        src: galleryForm.src,
        alt: galleryForm.alt,
        category: galleryForm.category,
        order: galleryForm.order,
        active: true,
        createdAt: new Date().toISOString(),
      }
      addGalleryItem(item)
      swalTheme.fire({ icon: 'success', title: 'Imagen agregada', timer: 1800, timerProgressBar: true, showConfirmButton: false })
    }
    setIsGalleryDialogOpen(false)
    setSelectedGalleryItem(null)
    setGalleryForm({ src: '', alt: '', category: 'General', order: 0 })
  }

  const handleDeleteGalleryItem = async (item: GalleryItem) => {
    const result = await swalTheme.fire({
      icon: 'warning',
      title: '¿Eliminar imagen?',
      text: `Se eliminará "${item.alt}" de la galería.`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (result.isConfirmed) {
      deleteGalleryItem(item.id)
      swalTheme.fire({ icon: 'success', title: 'Imagen eliminada', timer: 1500, timerProgressBar: true, showConfirmButton: false })
    }
  }

  // â"€â"€â"€ Testimonial handlers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTestimonial) {
      updateTestimonial(selectedTestimonial.id, { ...testimonialForm })
      swalTheme.fire({ icon: 'success', title: 'Testimonio actualizado', timer: 1800, timerProgressBar: true, showConfirmButton: false })
    } else {
      const t: Testimonial = {
        id: `test-${Date.now()}`,
        name: testimonialForm.name,
        role: testimonialForm.role,
        content: testimonialForm.content,
        rating: testimonialForm.rating,
        product: testimonialForm.product || undefined,
        image: testimonialForm.image,
        active: testimonialForm.active,
        createdAt: new Date().toISOString(),
      }
      addTestimonial(t)
      swalTheme.fire({ icon: 'success', title: 'Testimonio agregado', timer: 1800, timerProgressBar: true, showConfirmButton: false })
    }
    setIsTestimonialDialogOpen(false)
    setSelectedTestimonial(null)
    setTestimonialForm({ name: '', role: '', content: '', rating: 5, product: '', image: '/images/testimonial-1.jpg', active: true })
  }

  const handleDeleteTestimonial = async (t: Testimonial) => {
    const result = await swalTheme.fire({
      icon: 'warning',
      title: '¿Eliminar testimonio?',
      text: `Se eliminará el testimonio de "${t.name}".`,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    if (result.isConfirmed) {
      deleteTestimonial(t.id)
      swalTheme.fire({ icon: 'success', title: 'Testimonio eliminado', timer: 1500, timerProgressBar: true, showConfirmButton: false })
    }
  }

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSiteConfig(settingsForm)
    swalTheme.fire({
      icon: 'success',
      title: 'Sitio actualizado',
      text: 'Las imágenes, video y textos principales ya se pueden ver en la web.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter
    return matchesSearch && matchesStatus
  })

  const filteredMessages = messages.filter((m) => {
    const q = messageSearchQuery.toLowerCase()
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    )
  })

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 10)
  const unreadMessages = messages.filter((m) => !m.read).length
  const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all shadow-md">
                <Image
                  src="/images/logo-nazaret.jpg"
                  alt="I.E. Jesús de Nazaret"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-foreground">EcoNazaret</span>
                <p className="text-xs text-muted-foreground">Panel Administrativo</p>
              </div>
            </Link>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">
                  {username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{username}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Administrador
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.value
              const hasNotification = item.value === 'messages' && unreadMessages > 0
              const hasAlert = item.value === 'orders' && pendingOrders > 0

              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => {
                    setActiveTab(item.value)
                    setIsSidebarOpen(false)
                    setSearchQuery('')
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {hasNotification && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-destructive text-destructive-foreground rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                  {hasAlert && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500 text-white rounded-full">
                      {pendingOrders}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Quick stats */}
          <div className="p-4 border-t border-border">
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Resumen
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-card rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Pedidos</p>
                  <p className="font-bold text-foreground">{orders.length}</p>
                </div>
                <div className="bg-card rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Ventas</p>
                  <p className="font-bold text-primary">S/ {totalRevenue.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="font-semibold text-base text-foreground leading-tight">
                  {navItems.find((n) => n.value === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadMessages > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label={`${unreadMessages} mensajes sin leer`}
                >
                  <Mail className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                </button>
              )}
              <Link href="/tienda">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-1.5">
                  <Eye className="w-4 h-4" />
                  Ver tienda
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Leaf className="w-4 h-4" />
                  <span className="hidden sm:inline">Sitio web</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {/* â"€â"€â"€ Dashboard â"€â"€â"€ */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Stats grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Ingresos Totales',
                      value: `S/ ${totalRevenue.toFixed(2)}`,
                      change: '+12.5%',
                      up: true,
                      icon: DollarSign,
                      color: 'bg-emerald-500',
                      shadow: 'shadow-emerald-200',
                    },
                    {
                      label: 'Pedidos Pendientes',
                      value: pendingOrders.toString(),
                      change: `${orders.length} total`,
                      up: null,
                      icon: ShoppingCart,
                      color: 'bg-blue-500',
                      shadow: 'shadow-blue-200',
                    },
                    {
                      label: 'Productos Vendidos',
                      value: totalSold.toString(),
                      change: '+8.2%',
                      up: true,
                      icon: TrendingUp,
                      color: 'bg-violet-500',
                      shadow: 'shadow-violet-200',
                    },
                    {
                      label: 'Stock Bajo',
                      value: lowStockProducts.length.toString(),
                      change: 'Requiere atención',
                      up: false,
                      icon: AlertTriangle,
                      color: 'bg-orange-500',
                      shadow: 'shadow-orange-200',
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${stat.color} shadow-lg ${stat.shadow} flex items-center justify-center`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        {stat.up !== null && (
                          <div
                            className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-orange-600'}`}
                          >
                            {stat.up ? (
                              <ArrowUpRight className="w-3 h-3" />
                            ) : (
                              <ArrowDownRight className="w-3 h-3" />
                            )}
                            {stat.change}
                          </div>
                        )}
                        {stat.up === null && (
                          <span className="text-xs text-muted-foreground">{stat.change}</span>
                        )}
                      </div>
                      <div className="font-serif text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Two-column layout */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Recent orders */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-lg text-foreground">Pedidos Recientes</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('orders')}
                        className="text-primary"
                      >
                        Ver todos
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    {orders.length > 0 ? (
                      <div className="space-y-3">
                        {orders.slice(0, 4).map((order) => {
                          const config = statusConfig[order.status]
                          return (
                            <div
                              key={order.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-lg ${config.color} border flex items-center justify-center`}
                                >
                                  <config.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">
                                    {order.customerName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{order.id}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-foreground text-sm">
                                  S/ {order.total.toFixed(2)}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${config.color} mt-0.5`}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No hay pedidos aún</p>
                    )}
                  </div>

                  {/* Low stock alert */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-lg text-foreground">Alertas de Stock</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('products')}
                        className="text-primary"
                      >
                        Ver todos
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                    {lowStockProducts.length > 0 ? (
                      <div className="space-y-3">
                        {lowStockProducts.slice(0, 4).map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-foreground">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {categories.find((c) => c.id === product.category)?.name}
                                </p>
                              </div>
                            </div>
                            <Badge variant="destructive" className="text-xs">
                              {product.stock} uds.
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">Todo el stock está bien</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top products */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-lg text-foreground">
                      Productos Más Vendidos
                    </h2>
                    <Badge variant="secondary">{totalProducts} productos</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products
                      .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
                      .slice(0, 4)
                      .map((product, index) => (
                        <div
                          key={product.id}
                          className="relative bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                            {index + 1}
                          </div>
                          <div className="relative w-full h-24 rounded-lg overflow-hidden mb-3">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-medium text-sm text-foreground truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-primary font-semibold text-sm">
                              S/ {product.price}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.soldCount || 0} vendidos
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quick actions + unread messages row */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Quick actions */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h2 className="font-semibold text-base text-foreground mb-4">Acciones rápidas</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Nuevo producto', icon: Plus, tab: 'products', color: 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20' },
                        { label: 'Ver pedidos', icon: ShoppingCart, tab: 'orders', color: 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20' },
                        { label: 'Mensajes', icon: MessageSquare, tab: 'messages', color: 'bg-violet-500/10 text-violet-700 hover:bg-violet-500/20' },
                        { label: 'Configuración', icon: Settings, tab: 'settings', color: 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20' },
                      ].map((action) => (
                        <button
                          key={action.tab}
                          type="button"
                          onClick={() => setActiveTab(action.tab)}
                          className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-colors ${action.color}`}
                        >
                          <action.icon className="w-5 h-5" />
                          <span className="text-xs font-medium text-center">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Unread messages */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-semibold text-base text-foreground">Mensajes recientes</h2>
                      {unreadMessages > 0 && (
                        <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                          {unreadMessages} sin leer
                        </span>
                      )}
                    </div>
                    {messages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Sin mensajes aún</p>
                    ) : (
                      <div className="space-y-2">
                        {messages.slice(0, 4).map((msg) => (
                          <button
                            key={msg.id}
                            type="button"
                            onClick={() => { setActiveTab('messages'); setSelectedMessage(msg); if (!msg.read) markMessageRead(msg.id) }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors hover:bg-secondary/60 ${!msg.read ? 'bg-primary/5' : ''}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.read ? 'bg-secondary' : 'bg-primary/15'}`}>
                              {msg.read ? <MailOpen className="w-3.5 h-3.5 text-muted-foreground" /> : <Mail className="w-3.5 h-3.5 text-primary" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm truncate ${!msg.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{msg.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Products ─── */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedProduct(null)
                          resetProductForm()
                        }}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Producto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedProduct
                            ? 'Modifica los datos del producto.'
                            : 'Completa los datos del nuevo producto.'}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input
                            value={productForm.name}
                            onChange={(e) =>
                              setProductForm({ ...productForm, name: e.target.value })
                            }
                            placeholder="Ej: Café Orgánico Premium"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Descripción</Label>
                          <Textarea
                            value={productForm.description}
                            onChange={(e) =>
                              setProductForm({ ...productForm, description: e.target.value })
                            }
                            rows={3}
                            placeholder="Describe el producto..."
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Precio (S/)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={productForm.price}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  price: parseFloat(e.target.value) || 0,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              min="0"
                              value={productForm.stock}
                              onChange={(e) =>
                                setProductForm({
                                  ...productForm,
                                  stock: parseInt(e.target.value) || 0,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Categoría</Label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) =>
                              setProductForm({ ...productForm, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories
                                .filter((c) => c.id !== 'all')
                                .map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Imagen del producto</Label>
                          <div className="flex gap-2">
                            <Input
                              value={productForm.image}
                              onChange={(e) =>
                                setProductForm({ ...productForm, image: e.target.value })
                              }
                              placeholder="/images/producto.jpg"
                              className="flex-1"
                            />
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, 'productos', (url) => setProductForm((f) => ({ ...f, image: url })))
                                }}
                              />
                              <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                                <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
                              </Button>
                            </label>
                          </div>
                          {productForm.image && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border mt-1">
                              <Image src={productForm.image} alt="preview" fill className="object-cover" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Beneficios (separados por coma)</Label>
                          <Input
                            value={productForm.benefits?.join(', ')}
                            onChange={(e) =>
                              setProductForm({
                                ...productForm,
                                benefits: e.target.value.split(',').map((b) => b.trim()),
                              })
                            }
                            placeholder="Orgánico, Natural, Ecológico"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="featured"
                            aria-label="Marcar como producto destacado"
                            checked={productForm.featured}
                            onChange={(e) =>
                              setProductForm({ ...productForm, featured: e.target.checked })
                            }
                            className="rounded border-border"
                          />
                          <Label htmlFor="featured">Producto destacado</Label>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsProductDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit">
                            {selectedProduct ? 'Guardar cambios' : 'Crear producto'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Vendidos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{product.name}</p>
                                {product.featured && (
                                  <Badge variant="secondary" className="text-xs mt-0.5">
                                    <Star className="w-3 h-3 mr-1" />
                                    Destacado
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {categories.find((c) => c.id === product.category)?.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            S/ {product.price.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                product.stock < 10 ? 'text-destructive font-semibold' : ''
                              }
                            >
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>{product.soldCount || 0}</TableCell>
                          <TableCell>
                            {product.stock < 10 ? (
                              <Badge variant="destructive">Stock bajo</Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              >
                                Disponible
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteProduct(product)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            )}

            {/* â"€â"€â"€ Orders â"€â"€â"€ */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por ID o cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={orderStatusFilter} onValueChange={(v) => setOrderStatusFilter(v as Order['status'] | 'all')}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        {Object.entries(statusConfig).map(([key, cfg]) => (
                          <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((s) => {
                      const count = s === 'all' ? orders.length : orders.filter((o) => o.status === s).length
                      const isActive = orderStatusFilter === s
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setOrderStatusFilter(s)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            isActive ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {s === 'all' ? 'Todos' : statusConfig[s].label}
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-secondary'}`}>{count}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Pedido</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const config = statusConfig[order.status]
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-sm">{order.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {order.customerEmail}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-card"
                                  >
                                    <Image
                                      src={item.product.image}
                                      alt={item.product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium border-2 border-card">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              S/ {order.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value: Order['status']) =>
                                  handleOrderStatusChange(order.id, value)
                                }
                              >
                                <SelectTrigger className={`w-36 ${config.color} border`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(statusConfig).map(([key, val]) => (
                                    <SelectItem key={key} value={key}>
                                      <div className="flex items-center gap-2">
                                        <val.icon className="w-4 h-4" />
                                        {val.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Order detail dialog */}
                <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Pedido {selectedOrder?.id}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Cliente</p>
                            <p className="font-medium">{selectedOrder.customerName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Teléfono</p>
                            <p className="font-medium">{selectedOrder.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{selectedOrder.customerEmail}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Ciudad</p>
                            <p className="font-medium">
                              {selectedOrder.customerCity || 'No especificada'}
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Productos</p>
                          <div className="space-y-2">
                            {selectedOrder.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                                    <Image
                                      src={item.product.image}
                                      alt={item.product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      x{item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <p className="font-semibold text-sm">
                                  S/ {(item.product.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="text-xl font-bold text-primary">
                            S/ {selectedOrder.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}

            {/* â"€â"€â"€ Messages â"€â"€â"€ */}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {unreadMessages > 0
                      ? `${unreadMessages} mensaje${unreadMessages > 1 ? 's' : ''} sin leer`
                      : 'Todos los mensajes leídos'}
                  </p>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar mensajes..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {filteredMessages.length === 0 ? (
                        <p className="p-6 text-center text-sm text-muted-foreground">Sin resultados</p>
                      ) : filteredMessages.map((message) => (
                        <button
                          type="button"
                          key={message.id}
                          onClick={() => {
                            setSelectedMessage(message)
                            if (!message.read) markMessageRead(message.id)
                          }}
                          className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-secondary' : ''
                          } ${!message.read ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                message.read ? 'bg-secondary' : 'bg-primary/10'
                              }`}
                            >
                              {message.read ? (
                                <MailOpen className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <Mail className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p
                                  className={`font-medium text-sm truncate ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}
                                >
                                  {message.name}
                                </p>
                                {!message.read && (
                                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-foreground truncate">{message.subject}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(message.createdAt).toLocaleDateString('es-PE')}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
                    {selectedMessage ? (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              De: {selectedMessage.name} ({selectedMessage.email})
                            </p>
                            {selectedMessage.phone && (
                              <p className="text-sm text-muted-foreground">
                                Tel: {selectedMessage.phone}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/8"
                            onClick={() => handleDeleteMessage(selectedMessage)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <Separator />
                        <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                          {selectedMessage.message}
                        </p>
                        <Separator />
                        <div className="flex gap-2">
                          <Button asChild>
                            <a href={`mailto:${selectedMessage.email}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Responder por email
                            </a>
                          </Button>
                          {selectedMessage.phone && (
                            <Button variant="outline" asChild>
                              <a
                                href={`https://wa.me/51${selectedMessage.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                WhatsApp
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground min-h-50">
                        <div className="text-center">
                          <Mail className="w-12 h-12 mx-auto mb-4 opacity-40" />
                          <p>Selecciona un mensaje para ver los detalles</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* â"€â"€â"€ Gallery â"€â"€â"€ */}
            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-xl text-foreground">Galería de imágenes</h2>
                    <p className="text-sm text-muted-foreground mt-1">{gallery.length} imágenes en total</p>
                  </div>
                  <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setSelectedGalleryItem(null); setGalleryForm({ src: '', alt: '', category: 'General', order: gallery.length + 1 }) }}>
                        <Plus className="w-4 h-4 mr-2" /> Agregar imagen
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{selectedGalleryItem ? 'Editar imagen' : 'Agregar imagen'}</DialogTitle>
                        <DialogDescription>Sube una foto o pega la URL de la imagen.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGallerySubmit} className="space-y-4 mt-2">
                        <div className="space-y-2">
                          <Label>Imagen</Label>
                          <div className="flex gap-2">
                            <Input
                              value={galleryForm.src}
                              onChange={(e) => setGalleryForm({ ...galleryForm, src: e.target.value })}
                              placeholder="https://... o /images/..."
                              className="flex-1"
                              required
                            />
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, 'galeria', (url) => setGalleryForm((f) => ({ ...f, src: url })))
                                }}
                              />
                              <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                                <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
                              </Button>
                            </label>
                          </div>
                          {galleryForm.src && (
                            <div className="relative h-32 rounded-lg overflow-hidden border border-border">
                              <Image src={galleryForm.src} alt="preview" fill className="object-cover" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Descripción (alt)</Label>
                          <Input value={galleryForm.alt} onChange={(e) => setGalleryForm({ ...galleryForm, alt: e.target.value })} placeholder="Estudiantes en el biohuerto" required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Input value={galleryForm.category} onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} placeholder="Biohuerto" />
                          </div>
                          <div className="space-y-2">
                            <Label>Orden</Label>
                            <Input type="number" value={galleryForm.order} onChange={(e) => setGalleryForm({ ...galleryForm, order: Number(e.target.value) })} min={0} />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsGalleryDialogOpen(false)}>Cancelar</Button>
                          <Button type="submit" disabled={isUploadingImage}>
                            {selectedGalleryItem ? 'Actualizar' : 'Agregar'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {gallery.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-16 text-center">
                    <Images className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground">No hay imágenes en la galería.</p>
                    <p className="text-sm text-muted-foreground mt-1">Agrega tu primera foto usando el botón de arriba.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...gallery].sort((a, b) => a.order - b.order).map((item) => (
                      <div key={item.id} className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-4/3">
                          <Image src={item.src} alt={item.alt} fill className="object-cover" />
                          <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              onClick={() => {
                                setSelectedGalleryItem(item)
                                setGalleryForm({ src: item.src, alt: item.alt, category: item.category, order: item.order })
                                setIsGalleryDialogOpen(true)
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button type="button" size="icon" variant="destructive" onClick={() => handleDeleteGalleryItem(item)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{item.alt}</p>
                            <p className="text-xs text-muted-foreground">{item.category} · Orden {item.order}</p>
                          </div>
                          <button
                            type="button"
                            aria-label={item.active ? 'Desactivar' : 'Activar'}
                            onClick={() => updateGalleryItem(item.id, { active: !item.active })}
                          >
                            {item.active
                              ? <ToggleRight className="w-5 h-5 text-primary" />
                              : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* â"€â"€â"€ Testimonials â"€â"€â"€ */}
            {activeTab === 'testimonials' && (
              <motion.div
                key="testimonials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-xl text-foreground">Testimonios de clientes</h2>
                    <p className="text-sm text-muted-foreground mt-1">{testimonials.length} testimonios en total</p>
                  </div>
                  <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setSelectedTestimonial(null); setTestimonialForm({ name: '', role: '', content: '', rating: 5, product: '', image: '/images/testimonial-1.jpg', active: true }) }}>
                        <Plus className="w-4 h-4 mr-2" /> Agregar testimonio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{selectedTestimonial ? 'Editar testimonio' : 'Nuevo testimonio'}</DialogTitle>
                        <DialogDescription>Agrega la reseña de un cliente satisfecho.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleTestimonialSubmit} className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Nombre</Label>
                            <Input value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="María García" required />
                          </div>
                          <div className="space-y-2">
                            <Label>Rol / Ciudad</Label>
                            <Input value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="Agricultora, Cajamarca" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Testimonio</Label>
                          <Textarea value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} placeholder="Descripción del testimonio..." rows={3} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Calificación (1-5)</Label>
                            <Input type="number" min={1} max={5} value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} />
                          </div>
                          <div className="space-y-2">
                            <Label>Producto comprado</Label>
                            <Input value={testimonialForm.product} onChange={(e) => setTestimonialForm({ ...testimonialForm, product: e.target.value })} placeholder="Café Orgánico" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Foto del cliente</Label>
                          <div className="flex gap-2">
                            <Input value={testimonialForm.image} onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })} placeholder="/images/testimonial.jpg" className="flex-1" />
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleImageUpload(file, 'testimonios', (url) => setTestimonialForm((f) => ({ ...f, image: url })))
                                }}
                              />
                              <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                                <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
                              </Button>
                            </label>
                          </div>
                          {testimonialForm.image && (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-border">
                              <Image src={testimonialForm.image} alt="preview" fill className="object-cover" />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsTestimonialDialogOpen(false)}>Cancelar</Button>
                          <Button type="submit" disabled={isUploadingImage}>
                            {selectedTestimonial ? 'Actualizar' : 'Publicar'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {testimonials.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-16 text-center">
                    <Quote className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground">No hay testimonios aún.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testimonials.map((t) => (
                      <div key={t.id} className="bg-card rounded-2xl border border-border p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-primary/20">
                          <Image src={t.image} alt={t.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-foreground">{t.name}</p>
                              <p className="text-sm text-muted-foreground">{t.role}</p>
                              <div className="flex items-center gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                                ))}
                                {t.product && <span className="ml-2 text-xs text-primary font-medium">{t.product}</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                aria-label={t.active ? 'Desactivar' : 'Activar'}
                                onClick={() => updateTestimonial(t.id, { active: !t.active })}
                              >
                                {t.active
                                  ? <ToggleRight className="w-5 h-5 text-primary" />
                                  : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                              </button>
                              <Button type="button" size="icon" variant="ghost" onClick={() => {
                                setSelectedTestimonial(t)
                                setTestimonialForm({ name: t.name, role: t.role, content: t.content, rating: t.rating, product: t.product ?? '', image: t.image, active: t.active })
                                setIsTestimonialDialogOpen(true)
                              }}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button type="button" size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteTestimonial(t)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">&quot;{t.content}&quot;</p>
                          {!t.active && <Badge variant="secondary" className="mt-2 text-xs">Oculto</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* â"€â"€â"€ Settings â"€â"€â"€ */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <form onSubmit={handleSettingsSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-6">
                  <div>
                    <h2 className="font-semibold text-lg mb-1">Portada y medios del sitio</h2>
                    <p className="text-sm text-muted-foreground">
                      Cambia desde aquí el video o GIF de fondo del inicio y la foto de la sección Nosotros.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Imagen de respaldo del hero</Label>
                        <div className="flex gap-2">
                          <Input
                            value={settingsForm.heroBackgroundImage}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroBackgroundImage: e.target.value })}
                            placeholder="/images/hero-bg.jpg"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'sitio', (url) => setSettingsForm((f) => ({ ...f, heroBackgroundImage: url })))
                              }}
                            />
                            <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                              <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}</span>
                            </Button>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Video de fondo</Label>
                        <div className="flex gap-2">
                          <Input
                            value={settingsForm.heroVideoUrl}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroVideoUrl: e.target.value })}
                            placeholder="https://...mp4"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'sitio', (url) => setSettingsForm((f) => ({ ...f, heroVideoUrl: url })))
                              }}
                            />
                            <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                              <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Clapperboard className="w-4 h-4" />}</span>
                            </Button>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>GIF de fondo alternativo</Label>
                        <div className="flex gap-2">
                          <Input
                            value={settingsForm.heroGifUrl}
                            onChange={(e) => setSettingsForm({ ...settingsForm, heroGifUrl: e.target.value })}
                            placeholder="/images/gallery-1.jpg o https://...gif"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'sitio', (url) => setSettingsForm((f) => ({ ...f, heroGifUrl: url })))
                              }}
                            />
                            <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                              <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
                            </Button>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Foto de la sección Nosotros</Label>
                        <div className="flex gap-2">
                          <Input
                            value={settingsForm.aboutImage}
                            onChange={(e) => setSettingsForm({ ...settingsForm, aboutImage: e.target.value })}
                            placeholder="/images/about-students.jpg"
                            className="flex-1"
                          />
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(file, 'sitio', (url) => setSettingsForm((f) => ({ ...f, aboutImage: url })))
                              }}
                            />
                            <Button type="button" variant="outline" size="icon" disabled={isUploadingImage} asChild>
                              <span>{isUploadingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}</span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Texto superior</Label>
                        <Input value={settingsForm.heroBadge} onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Frase resaltada</Label>
                        <Input value={settingsForm.heroTitleAccent} onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleAccent: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Continuación del título</Label>
                        <Input value={settingsForm.heroTitleRest} onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleRest: e.target.value })} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Subtítulo 1</Label>
                        <Textarea rows={2} value={settingsForm.heroSubtitle1} onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle1: e.target.value })} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Subtítulo 2</Label>
                        <Textarea rows={2} value={settingsForm.heroSubtitle2} onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle2: e.target.value })} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Subtítulo 3</Label>
                        <Textarea rows={2} value={settingsForm.heroSubtitle3} onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle3: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isUploadingImage}>
                    Guardar cambios del sitio
                  </Button>
                </form>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-semibold text-lg mb-4">Información del Negocio</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre del negocio</Label>
                      <Input defaultValue="EcoNazaret" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email de contacto</Label>
                      <Input defaultValue="info@iejesusnazaret.edu.pe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input defaultValue="+51 976 123 456" />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input defaultValue="976123456" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Dirección</Label>
                      <Input defaultValue="Jr. Del Comercio 123, Cajamarca, Perú" />
                    </div>
                  </div>
                  <Button
                    className="mt-6"
                    onClick={() =>
                      swalTheme.fire({
                        icon: 'success',
                        title: '¡Guardado!',
                        text: 'La información del negocio fue actualizada.',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                      })
                    }
                  >
                    Guardar cambios
                  </Button>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="font-semibold text-lg mb-4">Configuración de envíos</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Costo de envío local (S/)</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Costo de envío nacional (S/)</Label>
                      <Input type="number" defaultValue="15" />
                    </div>
                    <div className="space-y-2">
                      <Label>Envío gratis desde (S/)</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                  </div>
                  <Button
                    className="mt-6"
                    onClick={() =>
                      swalTheme.fire({
                        icon: 'success',
                        title: '¡Guardado!',
                        text: 'La configuración de envíos fue actualizada.',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                      })
                    }
                  >
                    Guardar cambios
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}



