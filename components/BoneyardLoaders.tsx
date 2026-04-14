'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SkeletonBase = ({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className={`skeleton-boneyard ${className}`}
    style={{
      background: 'linear-gradient(90deg, var(--surface-low) 25%, var(--surface-high) 50%, var(--surface-low) 75%)',
      backgroundSize: '200% 100%',
      borderRadius: '12px',
      border: '1px solid var(--border-low)',
      ...style
    }}
  />
);

export const ChatSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
    <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
      <SkeletonBase style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SkeletonBase style={{ width: '200px', height: '20px' }} />
        <SkeletonBase style={{ width: '150px', height: '16px' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
      <SkeletonBase style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
        <SkeletonBase style={{ width: '180px', height: '20px' }} />
        <SkeletonBase style={{ width: '120px', height: '16px' }} />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
      <SkeletonBase style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <SkeletonBase style={{ width: '250px', height: '20px' }} />
        <SkeletonBase style={{ width: '220px', height: '20px' }} />
        <SkeletonBase style={{ width: '100px', height: '16px' }} />
      </div>
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <SkeletonBase style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <SkeletonBase style={{ width: '150px', height: '24px' }} />
        <SkeletonBase style={{ width: '200px', height: '16px' }} />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <SkeletonBase style={{ height: '100px' }} />
      <SkeletonBase style={{ height: '100px' }} />
      <SkeletonBase style={{ height: '100px' }} />
      <SkeletonBase style={{ height: '100px' }} />
    </div>
  </div>
);

export const ClockSkeleton = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
    <SkeletonBase style={{ width: '280px', height: '280px', borderRadius: '50%' }} />
  </div>
);
