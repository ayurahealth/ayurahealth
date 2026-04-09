'use client'
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Environment, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

function LiquidBrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Subtle rotation for the whole blob
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 128, 128]} scale={2.2}>
        <MeshDistortMaterial
          color="#050a07"
          attach="material"
          distort={0.4}       // Amount of warp (liquid feel)
          speed={1.5}         // Speed of warp
          roughness={0.15}    // Deeply reflective
          metalness={1.0}     // Perfectly metallic
          clearcoat={1.0}     // Extra liquid sheen layer
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  )
}

export default function WebGLBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        
        {/* Ambient & Directional Lighting matching Ayurveda's palette (Gold + Green) */}
        <ambientLight intensity={0.2} />
        
        {/* Core highlight - Toxic/Healing Green */}
        <directionalLight position={[5, 3, 5]} intensity={4} color="#34d399" />
        
        {/* Secondary highlight - Ancient Gold */}
        <directionalLight position={[-5, -3, -5]} intensity={3} color="#c9a84c" />
        
        {/* Backlight - Electric Blue for depth */}
        <pointLight position={[0, 0, -5]} intensity={2} color="#60a5fa" />

        {/* Floating particles (Medical Data Points) */}
        <Sparkles count={150} scale={12} size={2} speed={0.4} opacity={0.6} color="#c9a84c" />

        {/* Liquid Metal Brain */}
        <LiquidBrain />
        
        {/* Environmental Reflections */}
        <Environment preset="city" />

      </Canvas>
    </div>
  )
}
