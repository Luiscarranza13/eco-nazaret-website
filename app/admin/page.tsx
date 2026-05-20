'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, User, ShieldCheck, Leaf, ArrowRight, Sprout, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'

const features = [
  { icon: Leaf, text: 'Gestión de productos ecológicos' },
  { icon: Sprout, text: 'Control de pedidos en tiempo real' },
  { icon: Sun, text: 'Configuración del sitio web' },
]

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const success = await login(username, password)
    setIsLoading(false)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      setError('Usuario o contraseña incorrectos. Inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="admin-panel-left hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
      >
        {/* Background texture */}
        <div className="admin-panel-texture absolute inset-0 opacity-10" />

        {/* Floating orbs */}
        <div className="admin-panel-orb-main absolute top-20 right-20 w-64 h-64 rounded-full opacity-10" />
        <div className="admin-panel-orb-gold absolute bottom-32 left-10 w-48 h-48 rounded-full opacity-[0.08]" />

        {/* Floating leaves */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/15 text-4xl pointer-events-none"
            style={{ left: `${12 + i * 18}%`, top: `${8 + (i % 3) * 28}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 12, -8, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
          >
            🌿
          </motion.div>
        ))}

        {/* Logo + brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/30 group-hover:ring-white/60 transition-all shadow-xl">
              <Image src="/images/logo-nazaret.jpg" alt="I.E. Jesús de Nazaret" width={56} height={56} className="object-cover w-full h-full" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold text-white">I.E. Jesús de Nazaret</span>
              <span className="block text-xs text-white/60 tracking-widest uppercase">Bellavista · Celendín</span>
            </div>
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Panel Administrativo</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white leading-tight mb-4">
              Gestiona tu tienda<br />
              <span className="text-white/70">ecológica</span>
            </h2>
            <p className="text-white/65 text-base leading-relaxed mb-8">
              Controla productos, pedidos, mensajes y la configuración de tu sitio desde un solo lugar.
            </p>
            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white/75">{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EcoNazaret · Cajamarca, Perú
          </p>
        </div>
      </motion.div>

      {/* ── Right panel (form) ────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background relative">
        {/* Mobile brand */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-primary/30">
              <Image src="/images/logo-nazaret.jpg" alt="Logo" width={36} height={36} className="object-cover w-full h-full" />
            </div>
            <span className="font-serif font-bold text-foreground text-sm">EcoNazaret</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Acceso seguro</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Bienvenido</h1>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder al panel.</p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/8 px-4 py-3"
            >
              <div className="mt-0.5 w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
                <span className="text-destructive text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  placeholder="Ingresa tu usuario"
                  className={`pl-10 h-12 transition-colors ${error ? 'border-destructive/60 focus:border-destructive' : ''}`}
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Ingresa tu contraseña"
                  className={`pl-10 pr-11 h-12 transition-colors ${error ? 'border-destructive/60 focus:border-destructive' : ''}`}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-300 group"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Ingresar al panel
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-4">
            <p className="text-xs text-center font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Credenciales de demo
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Usuario</span>
                <code
                  className="bg-card border border-border px-2.5 py-1 rounded-lg font-mono text-foreground text-xs cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setUsername('admin')}
                  title="Click para autocompletar"
                >
                  admin
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Clave</span>
                <code
                  className="bg-card border border-border px-2.5 py-1 rounded-lg font-mono text-foreground text-xs cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setPassword('nazaret2024')}
                  title="Click para autocompletar"
                >
                  nazaret2024
                </code>
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground/60 mt-2">Click en los valores para autocompletar</p>
          </div>

          {/* Back link */}
          <div className="mt-5 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Volver al sitio principal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
