'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award, Heart, Leaf, Recycle, ShieldCheck, Sprout } from 'lucide-react'

const benefits = [
  {
    icon: Leaf,
    title: '100% orgánico',
    description: 'Cultivamos sin pesticidas ni químicos, usando métodos naturales y buenas prácticas agrícolas.',
  },
  {
    icon: Recycle,
    title: 'Producción sostenible',
    description: 'Aprovechamos mejor los recursos, reducimos residuos y fortalecemos el aprendizaje ambiental.',
  },
  {
    icon: Award,
    title: 'Calidad cuidada',
    description: 'Cada producto se revisa antes de llegar al cliente para mantener una presentación confiable.',
  },
  {
    icon: ShieldCheck,
    title: 'Libre de químicos',
    description: 'Priorizamos insumos limpios, procesos responsables y alimentos más sanos para la comunidad.',
  },
  {
    icon: Sprout,
    title: 'Impacto educativo',
    description: 'Cada compra apoya materiales, biohuertos y experiencias reales de aprendizaje para estudiantes.',
  },
  {
    icon: Heart,
    title: 'Compromiso local',
    description: 'Impulsamos una economía escolar conectada con Bellavista, Celendín y la región Cajamarca.',
  },
]

export function Benefits() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="beneficios" className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
          >
            Por qué elegirnos
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Beneficios de nuestros productos ecológicos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Más que vender productos, mostramos el trabajo de estudiantes que aprenden agricultura sostenible con impacto real.
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.18 + index * 0.06 }}
              className="group rounded-lg border border-border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">{benefit.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="mx-auto mt-12 grid max-w-4xl gap-4 rounded-lg border border-primary/20 bg-primary/5 p-5 shadow-sm sm:grid-cols-3 sm:p-6"
        >
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-primary">500+</div>
            <div className="mt-1 text-sm text-muted-foreground">familias atendidas</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-primary">100%</div>
            <div className="mt-1 text-sm text-muted-foreground">producción orgánica</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-3xl font-bold text-primary">2,750</div>
            <div className="mt-1 text-sm text-muted-foreground">msnm de cultivo</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
