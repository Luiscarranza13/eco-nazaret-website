'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Mountain, ShoppingBag, Sparkles, Users, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TypeAnimation } from 'react-type-animation'
import { useProductsStore } from '@/lib/store'

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url)
}

const localHeroVideo = '/videos/hero-background.mp4'
const oldRemoteHeroVideo = 'coverr-working-in-the-garden'

export function Hero() {
  const siteConfig = useProductsStore((state) => state.siteConfig)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isSoundOn, setIsSoundOn] = useState(false)

  const backgroundMedia = useMemo(() => {
    if (!siteConfig.heroVideoUrl || siteConfig.heroVideoUrl.includes(oldRemoteHeroVideo)) {
      return localHeroVideo
    }
    return siteConfig.heroVideoUrl || siteConfig.heroGifUrl || siteConfig.heroBackgroundImage
  }, [siteConfig.heroBackgroundImage, siteConfig.heroGifUrl, siteConfig.heroVideoUrl])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.18
    }
  }, [backgroundMedia])

  const toggleSound = async () => {
    const video = videoRef.current
    if (!video) return

    video.volume = 0.18
    video.muted = isSoundOn

    if (!isSoundOn) {
      video.muted = false
      await video.play().catch(() => undefined)
    }

    setIsSoundOn(!isSoundOn)
  }

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden bg-black pt-28 sm:pt-32">
      <div className="absolute inset-0">
        {backgroundMedia && isVideoUrl(backgroundMedia) ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover hero-loop-media"
            src={backgroundMedia}
            poster={siteConfig.heroBackgroundImage}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={backgroundMedia || siteConfig.heroBackgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover hero-loop-media"
          />
        )}
        <div className="absolute inset-0 bg-black/42" />
        <div className="absolute inset-0 bg-linear-to-r from-black/78 via-black/38 to-black/18" />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/32 backdrop-blur-md border border-white/20 mb-7 shadow-lg">
            <Sparkles className="w-4 h-4 text-green-300" />
            <span className="text-sm font-semibold text-white">{siteConfig.heroBadge}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.98] mb-6 max-w-5xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
            Cultivando <span className="hero-gradient-text">{siteConfig.heroTitleAccent}</span>{' '}
            {siteConfig.heroTitleRest}
          </h1>

          <div className="text-lg sm:text-xl text-white/88 mb-9 max-w-2xl leading-relaxed min-h-16 drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
            <TypeAnimation
              sequence={[
                600,
                siteConfig.heroSubtitle1,
                3000,
                siteConfig.heroSubtitle2,
                3000,
                siteConfig.heroSubtitle3,
                3000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tienda">
              <Button size="lg" className="text-base px-8 group bg-primary hover:bg-primary/90 shadow-xl shadow-black/30">
                <ShoppingBag className="mr-2 w-5 h-5" />
                Comprar Productos
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#nosotros">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 bg-white/12 border-white/45 text-white hover:bg-white/22 hover:text-white backdrop-blur-sm"
              >
                Conocer el Proyecto
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="grid grid-cols-3 gap-3 sm:gap-6 mt-14 pt-7 border-t border-white/18 max-w-2xl"
        >
          {[
            { value: '100%', label: 'Orgánico', icon: Leaf },
            { value: '300+', label: 'Estudiantes', icon: Users },
            { value: '2,750', label: 'msnm altura', icon: Mountain },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-black/22 p-3 backdrop-blur-sm border border-white/10">
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/12 text-green-300">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#nosotros"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
        aria-label="Ir a la sección Nosotros"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Descubrir</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </motion.a>

      {backgroundMedia && isVideoUrl(backgroundMedia) && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-6 right-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50"
          aria-label={isSoundOn ? 'Silenciar música de fondo' : 'Activar música de fondo'}
        >
          {isSoundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      )}
    </section>
  )
}
