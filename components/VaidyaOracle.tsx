'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface OracleProps {
  state?: 'idle' | 'listening' | 'thinking' | 'responding';
  framed?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   ARC REACTOR CORE — The pulsing heart of VAIDYA
   Inspired by Tony Stark's Arc Reactor: crisp blue-white 
   energy sphere with glass shell and emissive inner plasma
────────────────────────────────────────────────────────────── */
const ArcReactorCore = ({ state = 'idle' }: OracleProps) => {
  const plasmaCore = useRef<THREE.Mesh>(null!);
  const energyShell = useRef<THREE.Mesh>(null!);
  const glassHousing = useRef<THREE.Mesh>(null!);
  const innerPlasma = useRef<THREE.Mesh>(null!);

  const config = useMemo(() => {
    switch (state) {
      case 'listening':
        return {
          coreColor: '#00b4d8',
          plasmaColor: '#48cae4',
          shellColor: '#90e0ef',
          emissive: '#00b4d8',
          distort: 0.35,
          speed: 3.0,
          emissiveIntensity: 2.0,
          pulseRate: 2.0,
        };
      case 'thinking':
        return {
          coreColor: '#ff8800',
          plasmaColor: '#ffaa00',
          shellColor: '#ffd166',
          emissive: '#ff9500',
          distort: 0.65,
          speed: 7.0,
          emissiveIntensity: 3.5,
          pulseRate: 4.0,
        };
      case 'responding':
        return {
          coreColor: '#00f5ff',
          plasmaColor: '#72efdd',
          shellColor: '#a8dadc',
          emissive: '#00f5ff',
          distort: 0.45,
          speed: 3.5,
          emissiveIntensity: 2.5,
          pulseRate: 2.8,
        };
      default:
        return {
          coreColor: '#0077b6',
          plasmaColor: '#00b4d8',
          shellColor: '#48cae4',
          emissive: '#0096c7',
          distort: 0.25,
          speed: 1.8,
          emissiveIntensity: 1.2,
          pulseRate: 1.0,
        };
    }
  }, [state]);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (plasmaCore.current) {
      plasmaCore.current.rotation.x = Math.cos(t / 3) * 0.15;
      plasmaCore.current.rotation.y = t * 0.3;
      const p = 1 + Math.sin(t * config.pulseRate) * 0.04;
      plasmaCore.current.scale.setScalar(p);
    }
    if (innerPlasma.current) {
      const ip = 0.9 + Math.sin(t * (config.pulseRate + 1.5)) * 0.08;
      innerPlasma.current.scale.setScalar(ip);
      innerPlasma.current.rotation.z = -t * 0.5;
      innerPlasma.current.rotation.x = Math.sin(t * 0.7) * 0.2;
    }
    if (energyShell.current) {
      energyShell.current.rotation.y = -t * 0.15;
      const sp = 1 + Math.sin(t * config.pulseRate * 0.5) * 0.015;
      energyShell.current.scale.setScalar(sp);
    }
    if (glassHousing.current) {
      glassHousing.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group>
      {/* Inner plasma ball — the energy source */}
      <Sphere ref={innerPlasma} args={[0.4, 64, 64]} scale={1.0}>
        <meshPhysicalMaterial
          transparent
          opacity={0.95}
          roughness={0}
          metalness={0}
          clearcoat={1}
          color={config.plasmaColor}
          emissive={config.plasmaColor}
          emissiveIntensity={config.emissiveIntensity * 1.5}
        />
      </Sphere>

      {/* Distorted energy sphere — the arc reactor glow */}
      <Sphere ref={plasmaCore} args={[0.75, 128, 128]} scale={1.0}>
        <MeshDistortMaterial
          color={config.coreColor}
          attach="material"
          distort={config.distort}
          speed={config.speed}
          roughness={0.05}
          metalness={0.1}
          emissive={config.emissive}
          emissiveIntensity={config.emissiveIntensity}
          transparent
          opacity={0.7}
        />
      </Sphere>

      {/* Glass containment shell */}
      <Sphere ref={energyShell} args={[0.9, 64, 64]} scale={1.0}>
        <meshPhysicalMaterial
          transparent
          opacity={0.08}
          roughness={0}
          metalness={0.3}
          clearcoat={1}
          color="#ffffff"
          envMapIntensity={2.0}
        />
      </Sphere>

      {/* Outer wireframe housing — the arc reactor cage */}
      <Sphere ref={glassHousing} args={[1.0, 16, 16]} scale={1.0}>
        <meshBasicMaterial
          transparent
          opacity={state === 'idle' ? 0.06 : 0.12}
          color={config.emissive}
          wireframe={true}
        />
      </Sphere>
    </group>
  );
};

/* ─────────────────────────────────────────────────────────────
   HUD RINGS — Iron Man-style rotating holographic rings
   Multiple concentric torus rings at different axes and speeds
────────────────────────────────────────────────────────────── */
const HudRings = ({ state = 'idle' }: { state?: string }) => {
  const rings = useRef<THREE.Group>(null!);
  const ringRefs = [
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
  ];

  const config = useMemo(() => {
    const base = state === 'thinking'
      ? { color: '#ffaa00', speed: 1.2, opacity: 0.35 }
      : state === 'listening'
        ? { color: '#00e5ff', speed: 0.8, opacity: 0.3 }
        : state === 'responding'
          ? { color: '#00f5ff', speed: 0.9, opacity: 0.32 }
          : { color: '#0096c7', speed: 0.4, opacity: 0.18 };
    return base;
  }, [state]);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    const sp = config.speed;

    // Ring 1 — Main equatorial
    if (ringRefs[0].current) {
      ringRefs[0].current.rotation.x = Math.PI / 2;
      ringRefs[0].current.rotation.z = t * sp;
    }
    // Ring 2 — Tilted orbital A
    if (ringRefs[1].current) {
      ringRefs[1].current.rotation.x = Math.PI / 2.8 + Math.sin(t * 0.3) * 0.1;
      ringRefs[1].current.rotation.y = t * sp * 0.7;
    }
    // Ring 3 — Tilted orbital B (counter-rotate)
    if (ringRefs[2].current) {
      ringRefs[2].current.rotation.x = Math.PI / 1.6 + Math.cos(t * 0.25) * 0.08;
      ringRefs[2].current.rotation.y = -t * sp * 0.55;
    }
    // Ring 4 — Vertical scan ring
    if (ringRefs[3].current) {
      ringRefs[3].current.rotation.y = Math.PI / 2;
      ringRefs[3].current.rotation.z = t * sp * 0.45;
      ringRefs[3].current.rotation.x = Math.sin(t * 0.2) * 0.12;
    }
    // Ring 5 — Diagonal accent
    if (ringRefs[4].current) {
      ringRefs[4].current.rotation.x = Math.PI / 3.5;
      ringRefs[4].current.rotation.z = -t * sp * 0.35;
      ringRefs[4].current.rotation.y = Math.cos(t * 0.18) * 0.15;
    }
  });

  const ringData = [
    { radius: 1.35, tube: 0.012, segs: 200, opMult: 1.0 },
    { radius: 1.50, tube: 0.008, segs: 180, opMult: 0.7 },
    { radius: 1.22, tube: 0.010, segs: 160, opMult: 0.8 },
    { radius: 1.65, tube: 0.006, segs: 140, opMult: 0.5 },
    { radius: 1.10, tube: 0.007, segs: 120, opMult: 0.6 },
  ];

  return (
    <group ref={rings} scale={1.1}>
      {ringData.map((r, i) => (
        <mesh key={i} ref={ringRefs[i]} renderOrder={2}>
          <torusGeometry args={[r.radius, r.tube, 8, r.segs]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={config.opacity * r.opMult}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ─────────────────────────────────────────────────────────────
   SCANNING BEAM — A thin disc that oscillates vertically 
   through the core, mimicking JARVIS scan sequences
────────────────────────────────────────────────────────────── */
const ScanBeam = ({ state = 'idle' }: { state?: string }) => {
  const beam = useRef<THREE.Mesh>(null!);

  const config = useMemo(() => ({
    color: state === 'thinking' ? '#ffaa00' : state === 'listening' ? '#00e5ff' : '#0096c7',
    speed: state === 'thinking' ? 2.5 : state === 'listening' ? 1.5 : 0.6,
    opacity: state === 'idle' ? 0.06 : 0.14,
    range: state === 'thinking' ? 1.8 : 1.3,
  }), [state]);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (beam.current) {
      beam.current.position.y = Math.sin(t * config.speed) * config.range;
      beam.current.rotation.x = Math.PI / 2;
      // Subtle flicker
      const mat = beam.current.material as THREE.MeshBasicMaterial;
      mat.opacity = config.opacity + Math.sin(t * 12) * 0.02;
    }
  });

  return (
    <mesh ref={beam}>
      <ringGeometry args={[0, 1.7, 64]} />
      <meshBasicMaterial
        color={config.color}
        transparent
        opacity={config.opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/* ─────────────────────────────────────────────────────────────
   DATA STREAM PARTICLES — Structured particle flows
   resembling data being processed through JARVIS
────────────────────────────────────────────────────────────── */
const DataStream = ({ count = 600, state = 'idle' }: { count?: number; state?: string }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      const distance = 1.3 + THREE.MathUtils.randFloat(0, 0.6);
      p[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      p[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      p[i * 3 + 2] = distance * Math.cos(theta);
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    const speed = state === 'thinking' ? 0.6 : state === 'listening' ? 0.3 : 0.12;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * speed;
      pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }
  });

  const particleColor = state === 'thinking' ? '#ffaa00' : state === 'listening' ? '#48cae4' : '#0096c7';

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* @ts-expect-error - R3F bufferAttribute typings conflict with React 19 */}
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={state === 'thinking' ? 0.02 : 0.012}
        color={particleColor}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
};

/* ─────────────────────────────────────────────────────────────
   HOLOGRAPHIC HUD OVERLAY — HTML-based floating status text
   positioned around the 3D canvas for that Iron Man feel
────────────────────────────────────────────────────────────── */
const HudOverlay = ({ state = 'idle' }: { state?: string }) => {
  const [uptimeStr, setUptimeStr] = useState('00:00:00');

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const sec = String(elapsed % 60).padStart(2, '0');
      setUptimeStr(`${h}:${m}:${sec}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const accentColor = state === 'thinking' ? '#ffaa00' : state === 'listening' ? '#00e5ff' : '#0096c7';
  const accentGlow = state === 'thinking' ? 'rgba(255,170,0,0.4)' : state === 'listening' ? 'rgba(0,229,255,0.4)' : 'rgba(0,150,199,0.2)';

  const hudText: React.CSSProperties = {
    fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
    color: accentColor,
    fontSize: '0.55rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    textShadow: `0 0 8px ${accentGlow}`,
    opacity: 0.7,
    transition: 'all 0.5s ease',
    whiteSpace: 'nowrap',
  };

  const statusLabel = state === 'idle' ? 'STANDBY' : state === 'thinking' ? 'PROCESSING' : state === 'listening' ? 'ACTIVE SCAN' : 'TRANSMITTING';

  return (
    <>
      {/* Top-left: System ID */}
      <div style={{ position: 'absolute', top: '8%', left: '8%', pointerEvents: 'none', ...hudText }}>
        VAIDYA OS v3.1
      </div>

      {/* Top-right: Uptime */}
      <div style={{ position: 'absolute', top: '8%', right: '8%', pointerEvents: 'none', ...hudText, textAlign: 'right' }}>
        UPTIME {uptimeStr}
      </div>

      {/* Left side: Status readouts */}
      <div style={{ position: 'absolute', top: '35%', left: '5%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ ...hudText, opacity: 0.5 }}>SYS ▸ {statusLabel}</span>
        <span style={{ ...hudText, opacity: 0.4 }}>MED ▸ 8 TRADITIONS</span>
        <span style={{ ...hudText, opacity: 0.35 }}>RAG ▸ ONLINE</span>
      </div>

      {/* Right side: Model info */}
      <div style={{ position: 'absolute', top: '35%', right: '5%', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', textAlign: 'right' }}>
        <span style={{ ...hudText, opacity: 0.5 }}>MEDITRON ▸ OK</span>
        <span style={{ ...hudText, opacity: 0.4 }}>MEDGEMMA ▸ OK</span>
        <span style={{ ...hudText, opacity: 0.35 }}>COUNCIL ▸ 10/10</span>
      </div>

      {/* Bottom scan line decoration */}
      <div style={{
        position: 'absolute',
        bottom: '26%',
        left: '15%',
        right: '15%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        opacity: 0.2,
        pointerEvents: 'none',
      }} />
    </>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN EXPORT — VaidyaOracle: JARVIS Edition
────────────────────────────────────────────────────────────── */
export default function VaidyaOracle({ state = 'idle', framed = false }: OracleProps) {
  const modeLabel =
    state === 'idle'
      ? 'Clinical Oracle'
      : state === 'thinking'
        ? 'Synthesizing...'
        : state === 'listening'
          ? 'Listening'
          : 'Responding';

  const accentColor = state === 'thinking' ? '#ffaa00' : state === 'listening' ? '#00e5ff' : '#0096c7';

  return (
    <div style={{ width: '100%', height: '380px', position: 'relative' }}>
      {framed && (
        <>
          <div style={{
            position: 'absolute',
            inset: 8,
            borderRadius: 28,
            border: `1px solid rgba(0,150,199,0.1)`,
            background: 'linear-gradient(160deg, rgba(0,180,216,0.04), rgba(0,0,0,0.02))',
            backdropFilter: 'blur(16px)',
          }} />
          <div
            style={{
              position: 'absolute',
              inset: '4% 10%',
              borderRadius: 22,
              border: `1px solid rgba(0,150,199,0.08)`,
              background: 'linear-gradient(145deg, rgba(0,180,216,0.05), rgba(0,119,182,0.03))',
              filter: 'blur(0.2px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {/* Arc Reactor ambient glow */}
      <div style={{
        position: 'absolute',
        inset: framed ? '16% 18%' : '10% 14%',
        background: state === 'thinking'
          ? 'radial-gradient(circle, rgba(255,170,0,0.25) 0%, rgba(255,136,0,0.1) 35%, transparent 65%)'
          : `radial-gradient(circle, rgba(0,180,216,0.25) 0%, rgba(0,119,182,0.1) 35%, transparent 65%)`,
        filter: 'blur(28px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* HUD Text Overlay */}
      <HudOverlay state={state} />

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[6, 6, 8]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -4, -6]} intensity={0.8} color={accentColor} />
        <pointLight position={[0, 6, -4]} intensity={0.9} color={accentColor} />
        <pointLight position={[0, -3, 4]} intensity={0.5} color="#caf0f8" />

        <Float speed={state === 'thinking' ? 4 : 1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <ArcReactorCore state={state} />
          <HudRings state={state} />
          <ScanBeam state={state} />
          <DataStream state={state} />
        </Float>
      </Canvas>

      {/* Bottom Label — JARVIS-style system name */}
      <div style={{
        position: 'absolute',
        bottom: '4%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        width: '100%'
      }}>
        <h3 style={{
          color: accentColor,
          fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
          fontSize: '1.3rem',
          margin: 0,
          letterSpacing: '0.25em',
          fontWeight: 400,
          textShadow: `0 0 24px ${accentColor}`,
          transition: 'all 0.5s'
        }}>VAIDYA</h3>
        <p style={{
          color: 'rgba(0, 180, 216, 0.55)',
          fontSize: '0.6rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          marginTop: '0.3rem',
          fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
          transition: 'all 0.5s',
        }}>{modeLabel}</p>
      </div>
    </div>
  );
}
