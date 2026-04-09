'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface OracleProps {
  state?: 'idle' | 'listening' | 'thinking' | 'responding';
  framed?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   CONFIG — State-driven color palette
────────────────────────────────────────────────────────────── */
const getConfig = (state: string) => {
  switch (state) {
    case 'listening':
      return { primary: '#00e5ff', secondary: '#00b4d8', glow: '#00e5ff', speed: 0.9 };
    case 'thinking':
      return { primary: '#ffaa00', secondary: '#ff8800', glow: '#ffcc00', speed: 1.5 };
    case 'responding':
      return { primary: '#00f5ff', secondary: '#72efdd', glow: '#00f5ff', speed: 1.1 };
    default:
      return { primary: '#0096c7', secondary: '#0077b6', glow: '#00b4d8', speed: 0.5 };
  }
};

/* ─────────────────────────────────────────────────────────────
   CORE SPHERE — Uses only standard Three.js shaders (no drei shaders)
────────────────────────────────────────────────────────────── */
const CoreSphere = ({ state = 'idle' }: OracleProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const config = useMemo(() => getConfig(state), [state]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * config.speed * 0.4;
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      const s = 1 + Math.sin(t * config.speed) * 0.03;
      meshRef.current.scale.setScalar(s);
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * config.speed * 0.6;
      const si = 1 + Math.sin(t * config.speed * 1.4 + 1) * 0.05;
      innerRef.current.scale.setScalar(si);
    }
  });

  return (
    <group>
      {/* Bright inner core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.42, 64, 64]} />
        <meshStandardMaterial
          color={config.primary}
          emissive={config.primary}
          emissiveIntensity={2.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Outer glass shell */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.78, 64, 64]} />
        <meshStandardMaterial
          color={config.secondary}
          emissive={config.secondary}
          emissiveIntensity={0.8}
          roughness={0.05}
          metalness={0.2}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Outermost glow shell */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          color={config.primary}
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Wireframe cage */}
      <mesh>
        <sphereGeometry args={[1.05, 12, 12]} />
        <meshBasicMaterial
          color={config.primary}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
};

/* ─────────────────────────────────────────────────────────────
   HUD RINGS
────────────────────────────────────────────────────────────── */
const HudRings = ({ state = 'idle' }: { state?: string }) => {
  const ring0 = useRef<THREE.Mesh>(null!);
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);
  const ring4 = useRef<THREE.Mesh>(null!);
  const config = useMemo(() => getConfig(state), [state]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const sp = config.speed;
    if (ring0.current) {
      ring0.current.rotation.x = Math.PI / 2;
      ring0.current.rotation.z = t * sp;
    }
    if (ring1.current) {
      ring1.current.rotation.x = Math.PI / 2.8 + Math.sin(t * 0.3) * 0.1;
      ring1.current.rotation.y = t * sp * 0.7;
    }
    if (ring2.current) {
      ring2.current.rotation.x = Math.PI / 1.6 + Math.cos(t * 0.25) * 0.08;
      ring2.current.rotation.y = -t * sp * 0.55;
    }
    if (ring3.current) {
      ring3.current.rotation.y = Math.PI / 2;
      ring3.current.rotation.z = t * sp * 0.45;
    }
    if (ring4.current) {
      ring4.current.rotation.x = Math.PI / 3.5;
      ring4.current.rotation.z = -t * sp * 0.35;
    }
  });

  return (
    <group scale={1.1}>
      <mesh ref={ring0}>
        <torusGeometry args={[1.35, 0.012, 8, 200]} />
        <meshBasicMaterial color={config.primary} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring1}>
        <torusGeometry args={[1.50, 0.008, 8, 180]} />
        <meshBasicMaterial color={config.primary} transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.22, 0.010, 8, 160]} />
        <meshBasicMaterial color={config.secondary} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[1.65, 0.006, 8, 140]} />
        <meshBasicMaterial color={config.primary} transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring4}>
        <torusGeometry args={[1.10, 0.007, 8, 120]} />
        <meshBasicMaterial color={config.secondary} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

/* ─────────────────────────────────────────────────────────────
   SCAN BEAM — Vertical plane that sweeps
────────────────────────────────────────────────────────────── */
const ScanBeam = ({ state = 'idle' }: OracleProps) => {
  const beamRef = useRef<THREE.Mesh>(null!);
  const config = useMemo(() => getConfig(state), [state]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beamRef.current) {
      beamRef.current.rotation.y = t * config.speed * 1.2;
    }
  });

  return (
    <mesh ref={beamRef}>
      <planeGeometry args={[0.015, 2.6]} />
      <meshBasicMaterial
        color={config.primary}
        transparent
        opacity={state === 'idle' ? 0.22 : 0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/* ─────────────────────────────────────────────────────────────
   DATA STREAM — Orbiting particles
────────────────────────────────────────────────────────────── */
const DataStream = ({ state = 'idle' }: OracleProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const config = useMemo(() => getConfig(state), [state]);

  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 1.3 + (i % 3) * 0.18;
      return { angle, radius, offset: i * 0.4, size: 0.015 + (i % 4) * 0.008 };
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      const a = p.angle + t * config.speed * (i % 2 === 0 ? 1 : -0.7);
      child.position.x = Math.cos(a) * p.radius;
      child.position.z = Math.sin(a) * p.radius;
      child.position.y = Math.sin(t * 0.8 + p.offset) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i}>
          <sphereGeometry args={[p.size, 4, 4]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? config.primary : config.secondary}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ─────────────────────────────────────────────────────────────
   HUD TEXT OVERLAY — CSS-based, no WebGL needed
────────────────────────────────────────────────────────────── */
const HudOverlay = ({ state = 'idle' }: OracleProps) => {
  const [uptime, setUptime] = useState(0);
  const config = useMemo(() => getConfig(state), [state]);

  useEffect(() => {
    const t = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {/* Top-left */}
      <div style={{ position: 'absolute', top: '8%', left: '6%', fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '0.52rem', color: `${config.primary}99`, lineHeight: 1.7 }}>
        <div>SYS // VAIDYA-ORACLE</div>
        <div>ID // AH-{state.toUpperCase()}</div>
      </div>
      {/* Top-right */}
      <div style={{ position: 'absolute', top: '8%', right: '6%', fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '0.52rem', color: `${config.primary}80`, lineHeight: 1.7, textAlign: 'right' }}>
        <div>UP // {fmt(uptime)}</div>
        <div>STATUS // ONLINE</div>
      </div>
      {/* Bottom-left */}
      <div style={{ position: 'absolute', bottom: '18%', left: '6%', fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '0.48rem', color: `${config.primary}60`, lineHeight: 1.7 }}>
        <div>MODEL // MEDITRON-70B</div>
      </div>
      {/* Bottom-right */}
      <div style={{ position: 'absolute', bottom: '18%', right: '6%', fontFamily: '"SF Mono", "Fira Code", monospace', fontSize: '0.48rem', color: `${config.primary}60`, lineHeight: 1.7, textAlign: 'right' }}>
        <div>NET // SECURE</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT
────────────────────────────────────────────────────────────── */
export default function VaidyaOracle({ state = 'idle', framed = false }: OracleProps) {
  const config = useMemo(() => getConfig(state), [state]);
  const modeLabel =
    state === 'idle' ? 'Clinical Oracle'
      : state === 'thinking' ? 'Synthesizing...'
        : state === 'listening' ? 'Listening'
          : 'Responding';

  return (
    <div style={{ width: '100%', height: '380px', position: 'relative' }}>
      {framed && (
        <div style={{
          position: 'absolute', inset: 8, borderRadius: 28,
          border: `1px solid ${config.primary}18`,
          background: `linear-gradient(160deg, ${config.primary}08, rgba(0,0,0,0.02))`,
          backdropFilter: 'blur(16px)',
        }} />
      )}

      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: framed ? '16% 18%' : '10% 14%',
        background: `radial-gradient(circle, ${config.primary}30 0%, ${config.secondary}12 35%, transparent 65%)`,
        filter: 'blur(28px)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* HUD Overlay */}
      <HudOverlay state={state} />

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5.0], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[6, 6, 8]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -4, -6]} intensity={1.0} color={config.primary} />
        <pointLight position={[0, 6, -4]} intensity={1.0} color={config.primary} />
        <pointLight position={[0, -3, 4]} intensity={0.6} color="#caf0f8" />

        <Float speed={state === 'thinking' ? 4 : 1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <CoreSphere state={state} />
          <HudRings state={state} />
          <ScanBeam state={state} />
          <DataStream state={state} />
        </Float>
      </Canvas>

      {/* Label */}
      <div style={{
        position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', pointerEvents: 'none', width: '100%'
      }}>
        <h3 style={{
          color: config.primary,
          fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
          fontSize: '1.3rem', margin: 0, letterSpacing: '0.25em', fontWeight: 400,
          textShadow: `0 0 24px ${config.primary}`, transition: 'all 0.5s'
        }}>VAIDYA</h3>
        <p style={{
          color: `${config.primary}88`,
          fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.3em',
          marginTop: '0.3rem', fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
          transition: 'all 0.5s',
        }}>{modeLabel}</p>
      </div>
    </div>
  );
}
