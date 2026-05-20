import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { FeaturedProducts } from '@/components/featured-products'
import { Benefits } from '@/components/benefits'
import { Gallery } from '@/components/gallery'
import { Testimonials } from '@/components/testimonials'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { ScrollToTop } from '@/components/scroll-to-top'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <FeaturedProducts />
      <Benefits />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
    </main>
  )
}
