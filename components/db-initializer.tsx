'use client'

import { useEffect } from 'react'
import { useProductsStore } from '@/lib/store'
import { fetchAllData } from '@/lib/supabase-service'
import { supabase } from '@/lib/supabase'

export function DbInitializer() {
  const { dbLoaded, setAllData } = useProductsStore()

  useEffect(() => {
    const load = () =>
      fetchAllData()
        .then(({ productos, pedidos, mensajes, testimonios, galeria, siteConfig }) => {
          if (
            productos.length > 0 ||
            pedidos.length > 0 ||
            mensajes.length > 0 ||
            testimonios.length > 0 ||
            galeria.length > 0 ||
            siteConfig
          ) {
            setAllData(productos, pedidos, mensajes, testimonios, galeria, siteConfig)
          }
        })
        .catch((err) => {
          console.warn('[EcoNazaret] No se pudo conectar a Supabase, usando datos locales.', err)
        })

    if (!dbLoaded) load()

    // Suscripciones en tiempo real
    const channel = supabase
      .channel('econazaret-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mensajes_contacto' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonios' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'galeria' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'configuracion_sitio' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
