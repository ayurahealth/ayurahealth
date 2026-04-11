'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import type { JSX as ReactJSX } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   GLSL SHADERS — The "4D" Plasma Identity
────────────────────────────────────────────────────────────── */

// Simple Noise-based Plasma Shader
const PlasmaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00e5ff'),
    uIntensity: 1.0,
    uState: 0.0, // 0: idle, 1: listening, 2: thinking, 3: responding
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Slight ripple deformation
    float distortion = sin(position.y * 5.0 + uTime * 2.0) * 0.05;
    vec3 pos = position + normal * distortion;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;

  void main() {
    // Fresnel effect
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    
    // Moving plasma patterns
    float noise = sin(vPosition.x * 10.0 + uTime) * sin(vPosition.y * 10.0 + uTime) * sin(vPosition.z * 10.0 + uTime);
    
    vec3 finalColor = uColor * (fresnel + 0.3 + noise * 0.1);
    float alpha = fresnel * 0.8 + 0.2;
    
    gl_FragColor = vec4(finalColor * uIntensity, alpha);
  }
  `
);

extend({ PlasmaMaterial });

// Declaration for TS — using module augmentation instead of namespace
declare module '@react-three/fiber' {
  interface ThreeElements {
    plasmaMaterial: ReactJSX.IntrinsicElements['meshBasicMaterial'] & {
      ref?: React.Ref<THREE.ShaderMaterial>
      uTime?: number
      uColor?: THREE.Color
      uIntensity?: number
      uState?: number
      transparent?: boolean
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   COMPONENTS
────────────────────────────────────────────────────────────── */

const DNAHelix = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.8;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  const count = 12;
  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => {
        const y = (i - count / 2) * 0.15;
        const angle = i * 0.5;
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh position={[Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[-Math.cos(angle) * 0.4, 0, -Math.sin(angle) * 0.4]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
              <cylinderGeometry args={[0.005, 0.005, Math.abs(Math.cos(angle) * 0.8)]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Pre-computed particle positions (deterministic seed to avoid impure render)
function generateParticlePositions(): Float32Array {
  const p = new Float32Array(50 * 3);
  // Use a simple seeded pseudo-random for deterministic positions
  let seed = 42;
  const seededRandom = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < 50; i++) {
    const theta = seededRandom() * Math.PI * 2;
    const phi = Math.acos(2 * seededRandom() - 1);
    const r = 1.2 + seededRandom() * 0.4;
    p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    p[i * 3 + 2] = r * Math.cos(phi);
  }
  return p;
}
const PARTICLE_POSITIONS = generateParticlePositions();

const QuantumParticles = ({ color }: { color: string }) => {
  const points = useMemo(() => PARTICLE_POSITIONS, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
      ref.current.rotation.z = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.6} />
    </points>
  );
};

const ArcReactorHologram = ({ state = 'idle' }: { state: string }) => {
  const materialRef = useRef<THREE.ShaderMaterial & { uTime: number; uColor: THREE.Color; uIntensity: number }>(null!);
  
  const colors = {
    idle: new THREE.Color('#1a4d2e'),        // Sage Deep
    listening: new THREE.Color('#6abf8a'),   // Sage Accent
    thinking: new THREE.Color('#c9a84c'),    // Gold Accent
    responding: new THREE.Color('#e8dfc8'),  // Gold Pale
  };

  const activeColor = colors[state as keyof typeof colors] || colors.idle;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
      materialRef.current.uColor.lerp(activeColor, 0.1);
      materialRef.current.uIntensity = 1.0 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });

  return (
    <group>
      <DNAHelix color={activeColor.getStyle()} />
      <QuantumParticles color={activeColor.getStyle()} />
      
      {/* Core Plasma */}
      <mesh>
        <sphereGeometry args={[0.7, 64, 64]} />
        <plasmaMaterial ref={materialRef} transparent />
      </mesh>

      {/* Orbiting Photon Rings */}
      <group rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.6, 0.005, 16, 100]} />
          <meshBasicMaterial color={activeColor} transparent opacity={0.3} />
        </mesh>
      </group>
      <group rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[1.4, 0.005, 16, 100]} />
          <meshBasicMaterial color={activeColor} transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
};

/* ─────────────────────────────────────────────────────────────
   HUD UI COMPONENTS
────────────────────────────────────────────────────────────── */

const HudOverlay = ({ state = 'idle' }: { state: string }) => {
  const [uptime, setUptime] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const color = state === 'thinking' ? '#c9a84c' : '#6abf8a';

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {/* Corner Data Tags */}
      <div style={{ position: 'absolute', top: '10%', left: '8%', fontFamily: 'monospace', color: `${color}88`, fontSize: '0.6rem' }}>
        [V-ORACLE.SYS]<br/>ACT_MODE: {state.toUpperCase()}<br/>SIG_STRENGTH: 98%
      </div>
      <div style={{ position: 'absolute', top: '10%', right: '8%', fontFamily: 'monospace', color: `${color}88`, fontSize: '0.6rem', textAlign: 'right' }}>
        UPTIME: {uptime}s<br/>SEC_PROTO: ACTIVE<br/>LOC: GLOBAL_CORE
      </div>
      
      {/* Central Scanning Grid Effect (CSS) */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        width: '300px', height: '300px',
        transform: 'translate(-50%, -50%) perspective(1000px) rotateX(60deg)',
        border: `1px solid ${color}22`,
        background: `radial-gradient(circle, transparent 0%, ${color}08 70%)`,
        borderRadius: '50%',
        zIndex: -1
      }} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
────────────────────────────────────────────────────────────── */

export default function VaidyaOracle({ state = 'idle', framed = false }: { state?: 'idle' | 'listening' | 'thinking' | 'responding'; framed?: boolean }) {
  const accentColor = state === 'thinking' ? '#c9a84c' : '#6abf8a';

  return (
    <div className="vedic-glow" style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }}>
      {framed && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,20,30,0.8) 0%, transparent 80%)',
          zIndex: -1
        }} />
      )}

      <HudOverlay state={state} />

      <Canvas camera={{ position: [0, 0, 5], fov: 40 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <ArcReactorHologram state={state} />
        </Float>
      </Canvas>

      <div style={{
        position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none'
      }}>
        <h2 style={{
          color: accentColor, 
          fontFamily: 'var(--font-cormorant), serif', 
          fontSize: '1.8rem',
          fontWeight: 700,
          letterSpacing: '0.45em', 
          margin: 0, 
          textShadow: `0 0 25px ${accentColor}66`
        }}>VAIDYA</h2>
        <div style={{ color: `${accentColor}88`, fontSize: '0.62rem', fontWeight: 600, marginTop: '8px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
          Ancient Wisdom • Neural Synthesis
        </div>
      </div>
    </div>
  );
}
