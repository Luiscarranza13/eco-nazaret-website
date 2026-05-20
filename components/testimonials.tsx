'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductsStore } from '@/lib/store'
import { useEffect } from 'react'

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeIndex, setActiveIndex] = useState(0)
  const rawTestimonials = useProductsStore((s) => s.testimonials)
  const testimonials = rawTestimonials.filter((t) => t.active)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  if (testimonials.length === 0) return null

  const active = testimonials[Math.min(activeIndex, testimonials.length - 1)]
  const nextTestimonial = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const prevTestimonial = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="bg-linear-to-b from-secondary/35 to-background py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Testimonios
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Lo que dicen nuestros clientes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Opiniones reales de personas que compran y recomiendan los productos ecológicos del proyecto.
          </motion.p>
        </div>

        <div className="lg:hidden">
          <motion.article
            key={active.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-lg border border-border bg-card p-6 shadow-lg"
          >
            <Quote className="mb-4 h-8 w-8 text-primary" />
            <div className="mb-4 flex items-center gap-1">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-base leading-7 text-foreground/85">&quot;{active.content}&quot;</p>
            {active.product && (
              <span className="mt-5 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Compró: {active.product}
              </span>
            )}
            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full">
                <Image src={active.image} alt={active.name} fill className="object-cover" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{active.name}</div>
                <div className="text-sm text-muted-foreground">{active.role}</div>
              </div>
            </div>
          </motion.article>

          {testimonials.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Testimonio anterior">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Ver testimonio ${idx + 1}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      idx === activeIndex ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Testimonio siguiente">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="hidden gap-5 lg:grid lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.18 + index * 0.06 }}
              className="relative rounded-lg border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
            >
              <Quote className="mb-4 h-8 w-8 text-primary" />
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="min-h-28 text-sm leading-6 text-foreground/85">&quot;{testimonial.content}&quot;</p>
              {testimonial.product && (
                <span className="mt-5 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Compró: {testimonial.product}
                </span>
              )}
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20">
                  <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="mx-auto mt-12 grid max-w-4xl gap-4 rounded-lg border border-border bg-card p-5 text-center shadow-sm sm:grid-cols-3 sm:p-6"
        >
          <div>
            <div className="font-serif text-3xl font-bold text-foreground">500+</div>
            <div className="mt-1 text-sm text-muted-foreground">Clientes satisfechos</div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-foreground">4.9/5</div>
            <div className="mt-1 text-sm text-muted-foreground">Calificación promedio</div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-foreground">100%</div>
            <div className="mt-1 text-sm text-muted-foreground">Productos orgánicos</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
