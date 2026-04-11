'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BIOMARKER_MAP, getElementColor, Biomarker } from '@/lib/diagnostics/biomarkerData'

interface LabResult {
  id: string
  value: string
  status: 'optimal' | 'low' | 'high'
}

interface Props {
  results?: LabResult[]
}

const BiomarkerNode = ({ 
  marker, 
  result, 
  onHover 
}: { 
  marker: Biomarker, 
  result?: LabResult, 
  onHover: (m: Biomarker | null) => void 
}) => {
  const ref = useRef<THREE.Mesh>(null!)
  const color = getElementColor(marker.element)
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(clock.getElapsedTime() + marker.position[1]) * 0.001
      ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.05)
    }
  })

  return (
    <group position={marker.position}>
      <mesh 
        ref={ref}
        onPointerOver={() => onHover(marker)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={result ? 4 : 1}
          toneMapped={false}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, -0.15, 0]}
        fontSize={0.05}
        color="white"
        maxWidth={0.2}
        textAlign="center"
      >
        {marker.name}
      </Text>
      
      {/* Glow */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

const ConnectionLines = () => {
  const points = useMemo(() => {
    const p = []
    for (let i = 0; i < BIOMARKER_MAP.length; i++) {
      for (let j = i + 1; j < BIOMARKER_MAP.length; j++) {
        p.push(new THREE.Vector3(...BIOMARKER_MAP[i].position))
        p.push(new THREE.Vector3(...BIOMARKER_MAP[j].position))
      }
    }
    return p
  }, [])

  return (
    <lineSegments>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#6abf8a" transparent opacity={0.1} />
    </lineSegments>
  )
}

export default function HolographicLabMap({ results = [] }: Props) {
  const [hovered, setHovered] = useState<Biomarker | null>(null)

  return (
    <div style={{ width: '100%', height: '400px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        
        <ConnectionLines />
        
        {BIOMARKER_MAP.map(marker => (
          <BiomarkerNode 
            key={marker.id} 
            marker={marker} 
            result={results.find(r => r.id === marker.id)}
            onHover={setHovered}
          />
        ))}

        {/* Global Neural Cloud */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh visible={false}>
            <sphereGeometry args={[1.5, 32, 32]} />
          </mesh>
        </Float>
      </Canvas>

      {/* Overlay Info */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', pointerEvents: 'none' }}>
        <h4 style={{ 
          fontSize: '0.65rem', 
          color: 'rgba(232,223,200,0.4)', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em',
          margin: '0 0 0.5rem'
        }}>Biologic Synthesis Map</h4>
        {hovered ? (
          <div style={{ background: 'rgba(0,0,0,0.8)', padding: '0.6rem 0.8rem', borderRadius: '12px', border: `1px solid ${getElementColor(hovered.element)}66` }}>
            <p style={{ color: getElementColor(hovered.element), fontSize: '0.85rem', fontWeight: 600, margin: '0 0 0.2rem' }}>{hovered.name}</p>
            <p style={{ color: 'rgba(232,223,200,0.7)', fontSize: '0.7rem', margin: 0 }}>{hovered.vedicSignificance}</p>
          </div>
        ) : (
          <div style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.3)' }}>
            Hover over a node to reveal Vedic insights
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', textAlign: 'right', pointerEvents: 'none' }}>
        <div style={{ fontSize: '0.6rem', color: '#6abf8a', border: '1px solid #6abf8a33', padding: '0.2rem 0.5rem', borderRadius: '20px' }}>
          LIVE_DATA_FEED: ACTIVE
        </div>
      </div>
    </div>
  )
}
