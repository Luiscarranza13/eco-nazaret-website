'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useProductsStore } from '@/lib/store'
import { createMensaje } from '@/lib/supabase-service'

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const siteConfig = useProductsStore((s) => s.siteConfig)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    try {
      await createMensaje({
        nombre: data.get('name') as string,
        email: data.get('email') as string,
        telefono: data.get('phone') as string,
        asunto: 'Consulta desde el sitio web',
        mensaje: data.get('message') as string,
      })
      toast.success('Mensaje enviado correctamente. Te contactaremos pronto.')
      form.reset()
    } catch {
      toast.error('No se pudo enviar el mensaje. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const number = (siteConfig.whatsapp || '51999999999').replace(/\D/g, '')
  const whatsappMessage = encodeURIComponent(
    'Hola, me interesa conocer más sobre los productos ecológicos de la I.E. Jesús de Nazaret.'
  )
  const whatsappLink = `https://wa.me/${number}?text=${whatsappMessage}`

  const contactItems = [
    { icon: MapPin, title: 'Ubicación', value: siteConfig.address },
    { icon: Phone, title: 'Teléfono', value: siteConfig.phone },
    { icon: Mail, title: 'Correo', value: siteConfig.contactEmail },
  ]

  return (
    <section id="contacto" className="py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-primary"
            >
              Contacto
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              Hablemos de tu pedido
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
            >
              Escríbenos para consultar productos ecológicos, coordinación de compras o información del proyecto educativo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-8 space-y-4"
            >
              {contactItems.map((item) => (
                <div key={item.title} className="flex gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.32 }}
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex"
            >
              <Button size="lg" className="bg-[#128c4a] text-white hover:bg-[#0f7a40]">
                <MessageCircle className="mr-2 h-5 w-5" />
                Escribir por WhatsApp
              </Button>
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="rounded-lg border border-border bg-card p-5 shadow-lg sm:p-8"
          >
            <h3 className="font-serif text-2xl font-bold text-foreground">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" name="name" placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+51 999 999 999" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
