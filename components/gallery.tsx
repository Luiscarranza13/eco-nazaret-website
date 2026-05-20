'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useProductsStore, type GalleryItem } from '@/lib/store'

export function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const rawGallery = useProductsStore((s) => s.gallery)
  const images = rawGallery.filter((g) => g.active).sort((a, b) => a.order - b.order)

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null

  const openImage = (index: number) => setSelectedIndex(index)
  const closeImage = () => setSelectedIndex(null)
  const prevImage = () => setSelectedIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  const nextImage = () => setSelectedIndex((i) => (i !== null ? (i + 1) % images.length : null))

  useEffect(() => {
    if (selectedIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeImage()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedIndex])

  return (
    <>
      <section id="galeria" className="py-20 sm:py-28" ref={ref}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
            >
              Galería
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Imágenes del proyecto
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
            >
              Fotos del biohuerto, los productos y las actividades de la I.E. Jesús de Nazaret en Bellavista, Celendín.
            </motion.p>
          </div>

          {images.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No hay imágenes en la galería aún.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <motion.button
                  key={image.id}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.16 + index * 0.05 }}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
                  onClick={() => openImage(index)}
                >
                  <div className="relative aspect-4/3">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 text-white">
                    <span className="rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground">
                      {image.category}
                    </span>
                    <p className="mt-3 line-clamp-2 text-sm font-medium">{image.alt}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={closeImage}
        >
          {/* Close */}
          <button
            type="button"
            aria-label="Cerrar imagen"
            onClick={closeImage}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/25 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={(e) => { e.stopPropagation(); prevImage() }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={(e) => { e.stopPropagation(); nextImage() }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={selectedImage.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={selectedImage.src} alt={selectedImage.alt} fill className="rounded-lg object-contain" />
          </motion.div>

          {/* Caption + counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <p className="text-sm font-medium text-white/80">{selectedImage.alt}</p>
            {images.length > 1 && (
              <p className="mt-1 text-xs text-white/50">
                {selectedIndex! + 1} / {images.length}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
