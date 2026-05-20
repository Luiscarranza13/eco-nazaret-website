'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { ArrowRight, Globe, GraduationCap, Heart, Leaf, Target, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProductsStore } from '@/lib/store'

const features = [
  {
    icon: GraduationCap,
    title: 'Educación integral',
    description: 'Formamos jóvenes líderes con conciencia ecológica y capacidad para responder a retos reales.',
  },
  {
    icon: Leaf,
    title: 'Conciencia ecológica',
    description: 'Promovemos el cuidado del medio ambiente desde proyectos productivos y experiencias prácticas.',
  },
  {
    icon: Users,
    title: 'Espíritu de familia',
    description: 'Educamos en un clima fraternal, con respeto, unidad y trabajo colaborativo.',
  },
  {
    icon: Heart,
    title: 'Valores cristianos',
    description: 'Inspirados por María, fortalecemos la caridad, el servicio y el amor al prójimo.',
  },
  {
    icon: Target,
    title: 'Servicio y justicia',
    description: 'Valoramos la igualdad de las personas y la defensa responsable de los derechos humanos.',
  },
  {
    icon: Globe,
    title: 'Liderazgo cajamarquino',
    description: 'Buscamos una educación que trascienda y represente con orgullo a nuestra comunidad.',
  },
]

export function About() {
  const siteConfig = useProductsStore((state) => state.siteConfig)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="nosotros" className="bg-secondary/35 py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Sobre nosotros
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            I.E. Jesús de Nazaret - Bellavista, Celendín
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Somos una institución educativa mariana que une formación académica, valores cristianos y producción ecológica.
          </motion.p>
        </div>

        <div className="mb-14 grid gap-10 lg:mb-20 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-lg">
              <div className="relative aspect-4/3">
                <Image
                  src={siteConfig.aboutImage}
                  alt="Estudiantes de la I.E. Jesús de Nazaret trabajando en el biohuerto"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-5 rounded-lg border border-border bg-card px-5 py-4 shadow-lg sm:left-auto sm:right-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-foreground">2,750</div>
                  <div className="text-sm text-muted-foreground">msnm de altura</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="pt-7 lg:pt-0"
          >
            <h3 className="font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              Educación integral con valores humanistas y cristianos
            </h3>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                La I.E. Jesús de Nazaret acompaña a sus estudiantes para que vivan la fe desde el compromiso, la caridad y el servicio.
              </p>
              <p>
                Promovemos una educación de calidad donde cada joven reconoce su valor, desarrolla responsabilidad y aprende a resolver problemas.
              </p>
              <p>
                El proyecto ecológico convierte el biohuerto y los productos orgánicos en una experiencia de aprendizaje útil para la comunidad.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/tienda">
                <Button className="group">
                  Ver nuestros productos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#contacto">
                <Button variant="outline">Contactar al proyecto</Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 rounded-lg border border-border bg-secondary/40 p-4">
              {[
                { value: '300+', label: 'Estudiantes activos' },
                { value: '10+', label: 'Años de historia' },
                { value: '500+', label: 'Familias beneficiadas' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.26 + index * 0.06 }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-foreground">{feature.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
