'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  ArrowLeft,
  Coffee,
  Leaf,
  Sprout,
  Droplets,
  Trees,
  Flower2,
  Package,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useCartStore, useProductsStore, categories } from '@/lib/store'
import { toast } from 'sonner'

const categoryIcons: Record<string, typeof Coffee> = {
  all: Package,
  cafe: Coffee,
  compost: Leaf,
  humus: Sprout,
  fertilizante: Droplets,
  abono: Trees,
  biohuerto: Flower2,
}

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  
  const products = useProductsStore((state) => state.products)
  const addItem = useCartStore((state) => state.addItem)
  const itemCount = useCartStore((state) => state.getItemCount())

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [products, selectedCategory, searchQuery, sortBy])

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product)
    toast.success(`${product.name} agregado al carrito`)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">Categorías</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id]
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id)
                  setIsMobileFilterOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-4">Ordenar por</h3>
        <div className="space-y-2">
          {[
            { value: 'name', label: 'Nombre A-Z' },
            { value: 'price-asc', label: 'Precio: Menor a Mayor' },
            { value: 'price-desc', label: 'Precio: Mayor a Menor' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSortBy(option.value as typeof sortBy)
                setIsMobileFilterOpen(false)
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                sortBy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Volver al inicio</span>
            </Link>

            <Link href="/" className="font-serif text-xl font-bold text-foreground">
              EcoNazaret
            </Link>

            <Link href="/carrito" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Nuestra Tienda
          </h1>
          <p className="text-muted-foreground">
            Productos orgánicos cultivados con amor en las montañas de Celendín
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(selectedCategory !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filtros activos:</span>
                {selectedCategory !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory('all')}
                  >
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  >
                    &quot;{searchQuery}&quot;
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      layout
                      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-500"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Quick Add Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm text-foreground py-3 rounded-lg font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                        </motion.button>

                        {/* Category Badge */}
                        <Badge className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm text-foreground hover:bg-card">
                          {product.category}
                        </Badge>

                        {product.featured && (
                          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                            Destacado
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {product.description}
                        </p>

                        {/* Benefits */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.benefits.slice(0, 2).map((benefit) => (
                            <span
                              key={benefit}
                              className="text-xs px-2 py-1 bg-secondary rounded-full text-secondary-foreground"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-serif text-xl font-bold text-primary">
                            S/ {product.price.toFixed(2)}
                          </span>
                          <span
                            className={`text-xs ${
                              product.stock > 10
                                ? 'text-primary'
                                : product.stock > 0
                                ? 'text-accent'
                                : 'text-destructive'
                            }`}
                          >
                            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Limpiar filtros
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
