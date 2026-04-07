'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const OrbCore = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = Math.cos(time / 4) * 0.2;
      mesh.current.rotation.y = Math.sin(time / 2) * 0.2;
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 64, 64]} scale={1.2}>
      <MeshDistortMaterial
        color="#c9a84c"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0}
        metalness={1}
        emissive="#1a4d2e"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
};

const Particles = ({ count = 500 }) => {
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

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.1;
      pointsRef.current.rotation.z = time * 0.05;
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
        size={0.015}
        color="#6abf8a"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export default function VaidyaOracle() {
  return (
    <div style={{ width: '100%', height: '350px', position: 'relative', cursor: 'pointer' }}>
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <OrbCore />
          <Particles />
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
          color: '#c9a84c', 
          fontFamily: '"Cormorant Garamond", serif', 
          fontSize: '1.8rem', 
          margin: 0,
          letterSpacing: '0.05em',
          textShadow: '0 0 15px rgba(201,168,76,0.4)' 
        }}>VAIDYA</h3>
        <p style={{ 
          color: 'rgba(232, 223, 200, 0.4)', 
          fontSize: '0.65rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.3em',
          marginTop: '0.2rem'
        }}>Neural Oracle Mode</p>
      </div>
    </div>
  );
}
