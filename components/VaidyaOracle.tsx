'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface OracleProps {
  state?: 'idle' | 'listening' | 'thinking' | 'responding';
}

const OrbCore = ({ state = 'idle' }: OracleProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  
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
  });

  return (
    <Sphere ref={mesh} args={[1, 64, 64]} scale={1.2}>
      <MeshDistortMaterial
        color={config.color}
        attach="material"
        distort={config.distort}
        speed={config.speed}
        roughness={0}
        metalness={1}
        emissive={config.emissive}
        emissiveIntensity={state === 'thinking' ? 1.2 : 0.5}
      />
    </Sphere>
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

export default function VaidyaOracle({ state = 'idle' }: OracleProps) {
  return (
    <div style={{ width: '100%', height: '350px', position: 'relative', cursor: 'pointer' }}>
      <div style={{
        position: 'absolute',
        inset: '20% 15%',
        background: state === 'thinking'
          ? 'radial-gradient(circle, rgba(201,168,76,0.28) 0%, rgba(201,168,76,0.03) 65%, transparent 85%)'
          : 'radial-gradient(circle, rgba(106,191,138,0.22) 0%, rgba(106,191,138,0.03) 65%, transparent 85%)',
        filter: 'blur(20px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
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
          fontSize: '1.8rem', 
          margin: 0,
          letterSpacing: '0.05em',
          textShadow: `0 0 15px ${state === 'listening' ? 'rgba(106,191,138,0.4)' : 'rgba(201,168,76,0.4)'}`,
          transition: 'all 0.5s'
        }}>VAIDYA</h3>
        <p style={{ 
          color: 'rgba(232, 223, 200, 0.4)', 
          fontSize: '0.65rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.3em',
          marginTop: '0.2rem'
        }}>{state === 'idle' ? 'Neural Oracle Mode' : state.toUpperCase() + '...'}</p>
      </div>
    </div>
  );
}
