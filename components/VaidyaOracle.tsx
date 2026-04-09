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
  
  const config = useMemo(() => {
    switch (state) {
      case 'listening': return { color: '#6abf8a', distort: 0.5, speed: 4, emissive: '#2d7a45' };
      case 'thinking':  return { color: '#c9a84c', distort: 0.8, speed: 8, emissive: '#c9a84c' };
      case 'responding': return { color: '#34d399', distort: 0.6, speed: 3, emissive: '#1a4d2e' };
      default:           return { color: '#c9a84c', distort: 0.4, speed: 2, emissive: '#1a4d2e' };
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
      const pulse = 1 + Math.sin(time * (state === 'thinking' ? 2.4 : 1.6)) * 0.025;
      shell.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <Sphere ref={mesh} args={[1, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color={config.color}
          attach="material"
          distort={config.distort}
          speed={config.speed}
          roughness={0}
          metalness={1}
          emissive={config.emissive}
          emissiveIntensity={state === 'thinking' ? 1.25 : 0.55}
        />
      </Sphere>
      <Sphere ref={shell} args={[1.04, 64, 64]} scale={1.2}>
        <meshPhysicalMaterial
          transparent
          opacity={0.13}
          roughness={0}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0}
          color={state === 'thinking' ? '#f4d17f' : '#9ed6b2'}
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
        size={state === 'listening' ? 0.025 : 0.015}
        color={state === 'listening' ? '#6abf8a' : '#c9a84c'}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
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
          ? 'radial-gradient(circle, rgba(201,168,76,0.28) 0%, rgba(201,168,76,0.03) 65%, transparent 85%)'
          : 'radial-gradient(circle, rgba(106,191,138,0.22) 0%, rgba(106,191,138,0.03) 65%, transparent 85%)',
        filter: framed ? 'blur(20px)' : 'blur(24px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.62} />
        <pointLight position={[8, 8, 8]} intensity={1.1} />
        <pointLight position={[-6, -6, -6]} intensity={0.35} color="#6abf8a" />
        <pointLight position={[0, 4, -4]} intensity={0.45} color="#f7cd6d" />
        <Float speed={state === 'thinking' ? 5 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
          <OrbCore state={state} />
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
          color: state === 'listening' ? '#6abf8a' : '#c9a84c', 
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '1.65rem',
          margin: 0,
          letterSpacing: '0.04em',
          textShadow: `0 0 15px ${state === 'listening' ? 'rgba(106,191,138,0.4)' : 'rgba(201,168,76,0.4)'}`,
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
