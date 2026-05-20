'use client'

import { useRef, Suspense, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { Mesh, Points } from 'three'

interface OrbProps {
  position: [number, number, number]
  color: string
  distort?: number
  speed?: number
  radius?: number
  opacity?: number
}

function FloatingOrb({ position, color, distort = 0.3, speed = 1, radius = 1, opacity = 0.6 }: OrbProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.004 * speed
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.18
  })

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={1.0}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={1.5}
          transparent
          opacity={opacity}
          roughness={0.05}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  )
}

function Particles() {
  const pointsRef = useRef<Points>(null)
  const count = 2400

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const greenShades = [
      new THREE.Color('#4ade80'),
      new THREE.Color('#86efac'),
      new THREE.Color('#22c55e'),
      new THREE.Color('#a3e635'),
      new THREE.Color('#bbf7d0'),
      new THREE.Color('#dcfce7'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3
      const c = greenShades[Math.floor(Math.random() * greenShades.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.008) * 0.05
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[8, 8, 5]} intensity={2.5} color="#86efac" />
      <pointLight position={[-8, -4, -5]} intensity={1.0} color="#fde68a" />
      <pointLight position={[0, -8, 3]} intensity={0.8} color="#4ade80" />
      <pointLight position={[0, 6, 2]} intensity={0.6} color="#bbf7d0" />

      {/* Particles cloud */}
      <Particles />

      {/* Large anchor orbs */}
      <FloatingOrb position={[3.5, 0.5, -2]} color="#16a34a" distort={0.38} speed={0.6} radius={1.9} opacity={0.55} />
      <FloatingOrb position={[-3.2, 1.5, -2.5]} color="#22c55e" distort={0.28} speed={1.0} radius={1.4} opacity={0.58} />

      {/* Medium orbs */}
      <FloatingOrb position={[4.5, -1.5, -1]} color="#4ade80" distort={0.45} speed={0.85} radius={0.9} opacity={0.62} />
      <FloatingOrb position={[-1.8, 2.8, -3]} color="#86efac" distort={0.22} speed={1.3} radius={0.7} opacity={0.65} />
      <FloatingOrb position={[1.2, -2.5, -2]} color="#15803d" distort={0.32} speed={1.1} radius={0.75} opacity={0.58} />
      <FloatingOrb position={[-4.5, -0.5, -1.5]} color="#a3e635" distort={0.18} speed={1.5} radius={0.5} opacity={0.7} />

      {/* Small accent orbs */}
      <FloatingOrb position={[2.5, 2.8, -2.5]} color="#dcfce7" distort={0.42} speed={0.75} radius={0.42} opacity={0.75} />
      <FloatingOrb position={[-0.5, -3.5, -1]} color="#166534" distort={0.25} speed={1.8} radius={0.35} opacity={0.6} />
      <FloatingOrb position={[5, 1.5, -2.5]} color="#bbf7d0" distort={0.35} speed={1.2} radius={0.6} opacity={0.68} />
      <FloatingOrb position={[-5, 2, -3]} color="#4ade80" distort={0.3} speed={0.9} radius={0.45} opacity={0.65} />

      <Stars radius={80} depth={40} count={600} factor={3.5} saturation={0.4} fade speed={0.5} />
    </>
  )
}

export function HeroThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
    </Canvas>
  )
}
