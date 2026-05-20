'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'

const navLinks = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#productos', label: 'Productos' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Contacto' },
]

const sectionIds = navLinks.map((l) => l.href.replace('#', ''))

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const itemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -55% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const textClass = isScrolled ? 'text-foreground' : 'text-white'
  const mutedTextClass = isScrolled ? 'text-muted-foreground' : 'text-white/75'
  const linkClass = (href: string) => {
    const isActive = activeSection === href.replace('#', '')
    if (isScrolled) return isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
    return isActive ? 'text-white' : 'text-white/88 hover:text-white'
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-card/80 backdrop-blur-xl shadow-lg border-b border-border' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-white"
              >
                <Image
                  src="/images/logo-nazaret.jpg"
                  alt="Logo I.E. Jesús de Nazaret"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className={`font-serif text-xl font-bold transition-colors ${textClass}`}>
                  I.E. Jesús de Nazaret
                </span>
                <span className={`text-[10px] tracking-wider uppercase transition-colors ${mutedTextClass}`}>
                  Productos Ecológicos
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors relative group ${linkClass(link.href)}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/tienda">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hidden sm:flex ${isScrolled ? '' : 'text-white hover:bg-white/12 hover:text-white'}`}
                >
                  Tienda
                </Button>
              </Link>

              <Link href="/carrito" className="relative">
                <Button variant="outline" size="icon" className="relative bg-white/95 text-foreground hover:bg-white">
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

              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${isScrolled ? '' : 'text-white hover:bg-white/12 hover:text-white'}`}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/logo-nazaret.jpg"
                      alt="Logo I.E. Jesús de Nazaret"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-serif text-lg font-bold">I.E. Jesús de Nazaret</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors border-b border-border"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    className="mt-4"
                  >
                    <Link href="/tienda" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full" size="lg">
                        Ver Tienda
                      </Button>
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
