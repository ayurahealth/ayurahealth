'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface OracleProps {
  state?: 'idle' | 'listening' | 'thinking' | 'responding';
  framed?: boolean;
}

const OrbCore = ({ state = 'idle' }: OracleProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const shell = useRef<THREE.Mesh>(null!);
  const innerCore = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  
  const config = useMemo(() => {
    switch (state) {
      case 'listening':
        return {
          colorA: '#000000', // Deep black core
          colorB: '#00e5ff', // Cyan speculars
          distort: 0.65,
          speed: 4.5,
          emissive: '#00e5ff',
          pulse: 2.2,
        };
      case 'thinking':
        return {
          colorA: '#111111',
          colorB: '#ffaa00', // Molten Gold
          distort: 0.95, // Insane distortion for processing state
          speed: 8.5,
          emissive: '#ff9000',
          pulse: 3.5,
        };
      case 'responding':
        return {
          colorA: '#0a0a0a',
          colorB: '#5e43ff', // Deep purples and blues
          distort: 0.75,
          speed: 3.8,
          emissive: '#5e43ff',
          pulse: 2.5,
        };
      default:
        // Idle
        return {
          colorA: '#090909', // Pitch black metallic base
          colorB: '#c9a84c', // Subtle gold hints
          distort: 0.45,
          speed: 1.5,
          emissive: '#332a10', // Low golden ambient glow
          pulse: 1.2,
        };
    }
  }, [state]);

  useFrame((s) => {
    const time = s.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = Math.cos(time / 4) * 0.2;
      mesh.current.rotation.y = Math.sin(time / 2) * 0.2;
    }
    if (shell.current) {
      shell.current.rotation.y = -time * 0.22;
      shell.current.rotation.x = Math.cos(time / 5) * 0.06;
      const pulse = 1 + Math.sin(time * config.pulse) * 0.028;
      shell.current.scale.setScalar(pulse);
    }
    if (innerCore.current) {
      const innerPulse = 0.86 + Math.sin(time * (config.pulse + 0.65)) * 0.06;
      innerCore.current.scale.setScalar(innerPulse);
      innerCore.current.rotation.z = time * 0.35;
    }
    if (halo.current) {
      halo.current.rotation.y = time * 0.12;
      halo.current.rotation.x = -time * 0.08;
    }
  });

  return (
    <group>
      <Sphere ref={mesh} args={[1, 128, 128]} scale={1.2}>
        <MeshDistortMaterial
          color={config.colorA}
          attach="material"
          distort={config.distort}
          speed={config.speed}
          roughness={0.12} // Smooth wet/liquid look
          metalness={1.0} // Fully metallic
          emissive={config.emissive}
          emissiveIntensity={state === 'thinking' ? 2.5 : 0.85}
          clearcoat={1.0}
        />
      </Sphere>
      <Sphere ref={innerCore} args={[0.55, 64, 64]} scale={1.2}>
        <meshPhysicalMaterial
          transparent
          opacity={0.8}
          roughness={0}
          metalness={1.0}
          clearcoat={1.0}
          color={config.colorB}
          emissive={config.colorB}
          emissiveIntensity={1.2}
        />
      </Sphere>
      <Sphere ref={shell} args={[1.05, 128, 128]} scale={1.2}>
        <meshPhysicalMaterial
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.9}
          clearcoat={1}
          color="#ffffff"
          envMapIntensity={2.0}
        />
      </Sphere>
      <Sphere ref={halo} args={[1.35, 32, 32]} scale={1.2}>
        <meshBasicMaterial
          transparent
          opacity={state === 'idle' ? 0.05 : 0.15}
          color={config.emissive}
          wireframe={true} // Sci-fi structural aesthetic
        />
      </Sphere>
    </group>
  );
};

const Particles = ({ count = 500, state = 'idle' }: { count?: number; state?: string }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      const distance = 1.5 + THREE.MathUtils.randFloat(0, 0.5);
      p[i * 3] = distance * Math.sin(theta) * Math.cos(phi);
      p[i * 3 + 1] = distance * Math.sin(theta) * Math.sin(phi);
      p[i * 3 + 2] = distance * Math.cos(theta);
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);

  useFrame((s) => {
    const time = s.clock.getElapsedTime();
    const speed = state === 'listening' ? 0.4 : state === 'responding' ? 0.2 : 0.1;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * speed;
      pointsRef.current.rotation.z = time * (speed / 2);
    }
  });

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
        size={state === 'thinking' ? 0.025 : 0.015}
        color={state === 'thinking' ? '#ffaa00' : state === 'listening' ? '#00e5ff' : '#ffffff'}
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
};

const NeuralArcs = ({ state = 'idle' }: { state?: string }) => {
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const ringC = useRef<THREE.Mesh>(null!);

  const palette = useMemo(() => {
    switch (state) {
      case 'thinking':
        return { a: '#ffaa00', b: '#ff5500', c: '#ffffff', speed: 0.85 };
      case 'listening':
        return { a: '#00e5ff', b: '#0055ff', c: '#ffffff', speed: 0.65 };
      case 'responding':
        return { a: '#5e43ff', b: '#d4b4ff', c: '#ffffff', speed: 0.70 };
      default:
        return { a: '#c9a84c', b: '#8c7022', c: '#ffffff', speed: 0.35 };
    }
  }, [state]);

  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    const speed = palette.speed;
    if (ringA.current) {
      ringA.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.45) * 0.16;
      ringA.current.rotation.y = t * speed;
    }
    if (ringB.current) {
      ringB.current.rotation.x = Math.PI / 3.1 + Math.cos(t * 0.52) * 0.18;
      ringB.current.rotation.y = -t * speed * 0.86;
    }
    if (ringC.current) {
      ringC.current.rotation.x = Math.PI / 2.7 + Math.sin(t * 0.38) * 0.14;
      ringC.current.rotation.z = t * speed * 0.68;
    }
  });

  return (
    <group scale={1.18}>
      <mesh ref={ringA} renderOrder={2}>
        <torusGeometry args={[1.46, 0.014, 16, 180]} />
        <meshBasicMaterial color={palette.a} transparent opacity={0.26} />
      </mesh>
      <mesh ref={ringB} renderOrder={2}>
        <torusGeometry args={[1.32, 0.012, 16, 160]} />
        <meshBasicMaterial color={palette.b} transparent opacity={0.22} />
      </mesh>
      <mesh ref={ringC} renderOrder={2}>
        <torusGeometry args={[1.18, 0.01, 16, 140]} />
        <meshBasicMaterial color={palette.c} transparent opacity={0.19} />
      </mesh>
    </group>
  );
};

export default function VaidyaOracle({ state = 'idle', framed = false }: OracleProps) {
  const modeLabel =
    state === 'idle'
      ? 'Clinical Oracle'
      : state === 'thinking'
        ? 'Synthesizing'
        : state === 'listening'
          ? 'Listening'
          : 'Responding'

  return (
    <div style={{ width: '100%', height: '340px', position: 'relative' }}>
      {framed && (
        <>
          <div style={{
            position: 'absolute',
            inset: 8,
            borderRadius: 28,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
            backdropFilter: 'blur(16px)',
          }} />
          <div
            style={{
              position: 'absolute',
              inset: '4% 10%',
              borderRadius: 22,
              border: '1px solid rgba(201,168,76,0.16)',
              background: 'linear-gradient(145deg, rgba(201,168,76,0.08), rgba(106,191,138,0.04))',
              filter: 'blur(0.2px)',
              pointerEvents: 'none',
            }}
          />
        </>
      )}
      <div style={{
        position: 'absolute',
        inset: framed ? '16% 18%' : '12% 16%',
        background: state === 'thinking'
          ? 'radial-gradient(circle, rgba(255,170,0,0.3) 0%, rgba(255,85,0,0.15) 35%, transparent 70%)'
          : state === 'listening' 
          ? 'radial-gradient(circle, rgba(0,229,255,0.25) 0%, rgba(0,85,255,0.15) 35%, transparent 70%)'
          : 'radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(140,112,34,0.1) 40%, transparent 80%)',
        filter: framed ? 'blur(20px)' : 'blur(24px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 8, 8]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-6, -5, -6]} intensity={0.8} color={state === 'thinking' ? '#ff5500' : '#4b7cff'} />
        <pointLight position={[0, 8, -3]} intensity={1.0} color={state === 'listening' ? '#00e5ff' : '#c9a84c'} />
        <pointLight position={[0, -4, 5]} intensity={0.6} color="#ffffff" />
        <Float speed={state === 'thinking' ? 5 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
          <OrbCore state={state} />
          <NeuralArcs state={state} />
          <Particles state={state} />
        </Float>
      </Canvas>
      <div style={{ 
        position: 'absolute', 
        bottom: '5%', 
        left: '50%', 
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        width: '100%'
      }}>
        <h3 style={{
          color: state === 'thinking' ? '#ffaa00' : state === 'listening' ? '#00e5ff' : '#e8dfc8',
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '1.65rem',
          margin: 0,
          letterSpacing: '0.08em',
          textShadow: `0 0 20px ${state === 'thinking' ? 'rgba(255,170,0,0.6)' : state === 'listening' ? 'rgba(0,229,255,0.6)' : 'rgba(201,168,76,0.3)'}`,
          transition: 'all 0.5s'
        }}>VAIDYA</h3>
        <p style={{ 
          color: 'rgba(232, 223, 200, 0.52)', 
          fontSize: '0.68rem',
          textTransform: 'uppercase', 
          letterSpacing: '0.22em',
          marginTop: '0.2rem'
        }}>{modeLabel}</p>
      </div>
    </div>
  );
}
