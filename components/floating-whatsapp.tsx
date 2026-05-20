'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useProductsStore } from '@/lib/store'

export function FloatingWhatsApp() {
  const siteConfig = useProductsStore((s) => s.siteConfig)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const number = (siteConfig.whatsapp || '51999999999').replace(/\D/g, '')
  const message = encodeURIComponent(
    'Hola, me interesa conocer más sobre los productos ecológicos de la I.E. Jesús de Nazaret.'
  )
  const href = `https://wa.me/${number}?text=${message}`

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/20 transition-colors hover:bg-[#1fb855]"
          aria-label="Contactar por WhatsApp"
        >
          <MessageCircle className="h-7 w-7 fill-white stroke-none" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
