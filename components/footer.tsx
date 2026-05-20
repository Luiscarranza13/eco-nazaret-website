'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  productos: [
    { label: 'Café Orgánico', href: '/tienda?category=cafe' },
    { label: 'Compost', href: '/tienda?category=compost' },
    { label: 'Humus', href: '/tienda?category=humus' },
    { label: 'Fertilizantes', href: '/tienda?category=fertilizante' },
    { label: 'Biohuerto', href: '/tienda?category=biohuerto' },
  ],
  nosotros: [
    { label: 'Sobre el Proyecto', href: '#nosotros' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Contacto', href: '#contacto' },
  ],
  legal: [
    { label: 'Términos y Condiciones', href: '#' },
    { label: 'Política de Privacidad', href: '#' },
    { label: 'Devoluciones', href: '#' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/mariadenazaret.edu.pe', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-card pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-card/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30">
                <Image
                  src="/images/logo-nazaret.jpg"
                  alt="Logo I.E. Jesús de Nazaret"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-card">Jesús de Nazaret</span>
                <span className="text-[10px] text-card/60 tracking-wider uppercase">
                  Productos Ecológicos
                </span>
              </div>
            </Link>
            <p className="text-sm text-card/70 leading-relaxed mb-6">
              Institución educativa comprometida con la formación integral y sostenible
              desde Bellavista, Celendín, Cajamarca, Perú.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-card mb-4">Productos</h4>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-card mb-4">Nosotros</h4>
            <ul className="space-y-3">
              {footerLinks.nosotros.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-card mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-card/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-card mb-4">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-card/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>Bellavista, Celendín, Cajamarca</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-card/70">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <span>+51 999 999 999</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-card/70">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <span>info@iejesusnazaret.edu.pe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-sm text-card/50">
            &copy; {new Date().getFullYear()} I.E. Jesús de Nazaret - Bellavista. Todos los derechos reservados.
          </p>
          <p className="text-sm text-card/50">
            Formando para la vida desde las montañas de Cajamarca
          </p>
        </div>
      </div>
    </footer>
  )
}
