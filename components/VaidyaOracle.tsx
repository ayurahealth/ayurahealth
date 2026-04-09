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
          colorA: '#6fe3c5',
          colorB: '#4b7cff',
          distort: 0.48,
          speed: 3.8,
          emissive: '#6fe3c5',
          pulse: 1.8,
        };
      case 'thinking':
        return {
          colorA: '#8f7cff',
          colorB: '#ffd86b',
          distort: 0.78,
          speed: 7.2,
          emissive: '#ffd86b',
          pulse: 2.7,
        };
      case 'responding':
        return {
          colorA: '#7fffd4',
          colorB: '#a18bff',
          distort: 0.58,
          speed: 3.1,
          emissive: '#7fffd4',
          pulse: 2.1,
        };
      default:
        return {
          colorA: '#75d8b2',
          colorB: '#8a7ff7',
          distort: 0.4,
          speed: 1.9,
          emissive: '#8a7ff7',
          pulse: 1.4,
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
      <Sphere ref={mesh} args={[1, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          color={config.colorA}
          attach="material"
          distort={config.distort}
          speed={config.speed}
          roughness={0.05}
          metalness={0.85}
          emissive={config.emissive}
          emissiveIntensity={state === 'thinking' ? 1.35 : 0.72}
        />
      </Sphere>
      <Sphere ref={innerCore} args={[0.62, 64, 64]} scale={1.2}>
        <meshPhysicalMaterial
          transparent
          opacity={0.58}
          roughness={0.08}
          metalness={0.2}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          color={config.colorB}
          emissive={config.colorA}
          emissiveIntensity={0.5}
        />
      </Sphere>
      <Sphere ref={shell} args={[1.04, 64, 64]} scale={1.2}>
        <meshPhysicalMaterial
          transparent
          opacity={0.16}
          roughness={0}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0}
          color={config.colorB}
        />
      </Sphere>
      <Sphere ref={halo} args={[1.28, 64, 64]} scale={1.2}>
        <meshBasicMaterial
          transparent
          opacity={0.11}
          color={config.colorA}
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
        size={state === 'thinking' ? 0.02 : 0.016}
        color={state === 'thinking' ? '#ffd86b' : state === 'listening' ? '#6fe3c5' : '#8f7cff'}
        transparent
        opacity={0.72}
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
        return { a: '#ffd86b', b: '#8f7cff', c: '#7fffd4', speed: 0.62 };
      case 'listening':
        return { a: '#6fe3c5', b: '#4b7cff', c: '#d4b4ff', speed: 0.52 };
      case 'responding':
        return { a: '#7fffd4', b: '#a18bff', c: '#ffd86b', speed: 0.56 };
      default:
        return { a: '#8a7ff7', b: '#75d8b2', c: '#ffd9a8', speed: 0.44 };
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
          ? 'radial-gradient(circle, rgba(255,216,107,0.33) 0%, rgba(143,124,255,0.18) 42%, rgba(255,216,107,0.03) 70%, transparent 90%)'
          : 'radial-gradient(circle, rgba(111,227,197,0.28) 0%, rgba(138,127,247,0.15) 44%, rgba(111,227,197,0.03) 70%, transparent 90%)',
        filter: framed ? 'blur(20px)' : 'blur(24px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.56} />
        <pointLight position={[8, 8, 8]} intensity={1.05} color="#b2c7ff" />
        <pointLight position={[-6, -5, -6]} intensity={0.4} color="#6fe3c5" />
        <pointLight position={[0, 5, -3]} intensity={0.48} color="#ffd86b" />
        <pointLight position={[0, -4, 3]} intensity={0.3} color="#8f7cff" />
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
          color: state === 'thinking' ? '#ffd86b' : state === 'listening' ? '#6fe3c5' : '#d7c5ff',
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '1.65rem',
          margin: 0,
          letterSpacing: '0.04em',
          textShadow: `0 0 16px ${state === 'thinking' ? 'rgba(255,216,107,0.45)' : state === 'listening' ? 'rgba(111,227,197,0.45)' : 'rgba(143,124,255,0.45)'}`,
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
