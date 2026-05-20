import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { DbInitializer } from '@/components/db-initializer'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  title: 'EcoNazaret | Productos Orgánicos del Valle de Bellavista',
  description: 'Productos orgánicos cultivados por estudiantes de la I.E. Jesús de Nazaret en Bellavista, Celendín, Cajamarca. Café orgánico, compost, humus y más.',
  keywords: ['orgánico', 'café peruano', 'compost', 'humus', 'Celendín', 'Cajamarca', 'agricultura sostenible', 'biohuerto'],
  authors: [{ name: 'I.E. Jesús de Nazaret' }],
  openGraph: {
    title: 'EcoNazaret | Productos Orgánicos del Valle de Bellavista',
    description: 'Cultivando un futuro sostenible desde las montañas de Cajamarca',
    type: 'website',
    locale: 'es_PE'
  }
}

export const viewport: Viewport = {
  themeColor: '#4a7c59',
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        <DbInitializer />
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
