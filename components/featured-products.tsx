'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useProductsStore } from '@/lib/store'
import { toast } from 'sonner'

export function FeaturedProducts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const products = useProductsStore((state) => state.products)
  const addItem = useCartStore((state) => state.addItem)

  const featuredProducts = products.filter((p) => p.featured).slice(0, 4)

  const handleAddToCart = (product: typeof products[0]) => {
    addItem(product)
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <section id="productos" className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
            >
              Nuestros Productos
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Productos destacados
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/tienda">
              <Button variant="outline" className="group">
                Ver todos los productos
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.16 + index * 0.06 }}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddToCart(product)}
                  className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-center gap-2 rounded-lg bg-card/95 py-3 font-medium text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Agregar al carrito
                </motion.button>

                <Badge className="absolute left-4 top-4 bg-card/90 text-foreground backdrop-blur-sm hover:bg-card">
                  {product.category}
                </Badge>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">(4.9)</span>
                </div>
                <h3 className="mb-1 line-clamp-1 font-semibold text-foreground transition-colors group-hover:text-primary">
                  {product.name}
                </h3>
                <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl font-bold text-primary">
                    S/ {product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
