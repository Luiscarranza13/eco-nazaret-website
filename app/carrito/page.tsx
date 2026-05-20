'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  Leaf,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCartStore, useProductsStore, type Order } from '@/lib/store'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore()
  const { addOrder } = useProductsStore()
  const [isCheckout, setIsCheckout] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const total = getTotal()
  const shipping = total > 100 ? 0 : 15
  const finalTotal = total + shipping

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create order
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: items,
      total: finalTotal,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    addOrder(order)
    setOrderComplete(true)
    setIsSubmitting(false)
  }

  const handleWhatsAppOrder = () => {
    const itemsList = items
      .map((item) => `- ${item.quantity}x ${item.product.name} (S/${(item.product.price * item.quantity).toFixed(2)})`)
      .join('%0A')

    const message = encodeURIComponent(
      `Hola! Me gustaría hacer un pedido:\n\n${itemsList}\n\nTotal: S/${finalTotal.toFixed(2)}\n\nNombre: ${formData.name}\nTeléfono: ${formData.phone}\nEmail: ${formData.email}`
    )

    window.open(`https://wa.me/51999999999?text=${message}`, '_blank')
    clearCart()
    setOrderComplete(true)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
            Pedido Realizado
          </h1>
          <p className="text-muted-foreground mb-6">
            Gracias por tu compra. Te contactaremos pronto para confirmar los detalles de entrega.
          </p>
          <Link href="/">
            <Button className="w-full">Volver al inicio</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/tienda"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Seguir comprando</span>
            </Link>

            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-bold text-foreground">EcoNazaret</span>
            </Link>

            <div className="w-20" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-8">
          {isCheckout ? 'Finalizar Pedido' : 'Tu Carrito'}
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-20 h-20 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="font-semibold text-xl text-foreground mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-muted-foreground mb-6">
              Explora nuestra tienda y encuentra productos orgánicos increíbles
            </p>
            <Link href="/tienda">
              <Button size="lg">Ir a la tienda</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items / Checkout Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {!isCheckout ? (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-4 bg-card rounded-xl border border-border p-4"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            S/ {item.product.price.toFixed(2)} c/u
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              removeItem(item.product.id)
                              toast.success('Producto eliminado del carrito')
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                          <span className="font-serif text-lg font-bold text-primary">
                            S/ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        clearCart()
                        toast.success('Carrito vaciado')
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Vaciar carrito
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="checkout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmitOrder}
                    className="bg-card rounded-xl border border-border p-6 space-y-6"
                  >
                    <div>
                      <h2 className="font-semibold text-lg text-foreground mb-4">
                        Datos de contacto
                      </h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Tu nombre"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="+51 999 999 999"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="tu@email.com"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h2 className="font-semibold text-lg text-foreground mb-4">
                        Método de pedido
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                              Procesando...
                            </>
                          ) : (
                            'Confirmar Pedido'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white border-0"
                          onClick={handleWhatsAppOrder}
                          disabled={!formData.name || !formData.phone || !formData.email}
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Pedir por WhatsApp
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setIsCheckout(false)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Volver al carrito
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-lg text-foreground mb-4">
                  Resumen del pedido
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-foreground">
                        S/ {(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">S/ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-foreground">
                      {shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {total < 100 && (
                    <p className="text-xs text-primary">
                      Agrega S/ {(100 - total).toFixed(2)} más para envío gratis
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span className="text-foreground">Total</span>
                  <span className="font-serif text-primary">
                    S/ {finalTotal.toFixed(2)}
                  </span>
                </div>

                {!isCheckout && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setIsCheckout(true)}
                  >
                    Proceder al pago
                  </Button>
                )}

                <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    Todos nuestros productos son 100% orgánicos y elaborados con
                    amor por estudiantes de la I.E. Jesús de Nazaret
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
