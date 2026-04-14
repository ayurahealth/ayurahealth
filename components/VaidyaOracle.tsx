'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function VaidyaOracle({ state = 'idle' }: { state?: 'idle' | 'listening' | 'thinking' | 'responding' }) {
  const colors = {
    idle: '#6abf8a',
    listening: '#60a5fa',
    thinking: '#c9a84c',
    responding: '#e8dfc8',
  };

  const activeColor = colors[state] || colors.idle;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        {/* Simple concentric circles replacing the 3D orb */}
        <motion.div
          animate={{
            scale: state === 'listening' ? [1, 1.2, 1] : 1,
            opacity: state === 'thinking' ? [0.3, 0.6, 0.3] : 0.4
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            position: 'absolute',
            inset: 0,
            border: `1px solid ${activeColor}`,
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{
            scale: state === 'responding' ? [1, 1.1, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            inset: '15px',
            border: `2px solid ${activeColor}`,
            borderRadius: '50%',
            opacity: 0.8
          }}
        />
        <div style={{
          position: 'absolute',
          inset: '35px',
          background: activeColor,
          borderRadius: '50%',
          boxShadow: `0 0 20px ${activeColor}44`
        }} />
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <div style={{ 
          color: activeColor, 
          fontSize: '0.75rem', 
          fontWeight: 700, 
          letterSpacing: '0.2em', 
          textTransform: 'uppercase' 
        }}>
          Vaidya AI
        </div>
        <div style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.65rem', 
          marginTop: '0.5rem', 
          letterSpacing: '0.05em' 
        }}>
          {state === 'idle' ? 'System Ready' : 
           state === 'listening' ? 'Clinical Input Detected' :
           state === 'thinking' ? 'Analyzing Patterns' : 
           'Clinical Synthesis'}
        </div>
      </div>
    </div>
  );
}
