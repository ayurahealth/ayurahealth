'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

interface ClockSegment {
  dosha: DoshaType;
  start: number;
  end: number;
  ritual: string;
  color: string;
}

const SEGMENTS: ClockSegment[] = [
  { dosha: 'Kapha', start: 6, end: 10, ritual: 'Movement & Vigor', color: '#6abf8a' },
  { dosha: 'Pitta', start: 10, end: 14, ritual: 'Digestive Fire', color: '#c9a84c' },
  { dosha: 'Vata', start: 14, end: 18, ritual: 'Fluid Creativity', color: '#7aafd4' },
  { dosha: 'Kapha', start: 18, end: 22, ritual: 'Gentle Unwinding', color: '#3a9455' },
  { dosha: 'Pitta', start: 22, end: 2, ritual: 'Liver Restoration', color: '#8a6d1a' },
  { dosha: 'Vata', start: 2, end: 6, ritual: 'Ancestral Silence', color: '#162e21' },
];

export default function AyurvedicCycle({ userDosha }: { userDosha?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const decimalTime = hours + minutes / 60;

  const currentSegment = useMemo(() => {
    return SEGMENTS.find(s => {
      if (s.start < s.end) return decimalTime >= s.start && decimalTime < s.end;
      return decimalTime >= s.start || decimalTime < s.end;
    }) || SEGMENTS[0];
  }, [decimalTime]);

  // Personalized Ritual Logic
  const personalizedRitual = useMemo(() => {
    if (!userDosha) return currentSegment.ritual;
    if (userDosha.includes(currentSegment.dosha)) {
      return `✨ Specialized for you: ${currentSegment.ritual}`;
    }
    return currentSegment.ritual;
  }, [userDosha, currentSegment]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1rem'
    }}>
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        {/* Orbital Ring */}
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="2" 
          />
          
          {/* Active Segment Arc */}
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={currentSegment.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="282.7"
            initial={{ strokeDashoffset: 282.7 }}
            animate={{ strokeDashoffset: 282.7 - (282.7 * (decimalTime / 24)) }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ rotate: -90, originX: '50px', originY: '50px' }}
          />

          {/* Glowing Indicator */}
          <motion.circle
            cx={50 + 45 * Math.cos(((decimalTime / 24) * 360 - 90) * Math.PI / 180)}
            cy={50 + 45 * Math.sin(((decimalTime / 24) * 360 - 90) * Math.PI / 180)}
            r="3"
            fill={currentSegment.color}
            style={{ filter: `blur(2px) drop-shadow(0 0 8px ${currentSegment.color})` }}
          />
        </svg>

        {/* Time Center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#e8dfc8', fontFamily: '"DM Sans", sans-serif' }}>
            {hours.toString().padStart(2, '0')}<span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>:</span>{minutes.toString().padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.6rem', color: currentSegment.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {currentSegment.dosha} Era
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 280 }}>
        <h3 style={{ fontSize: '1rem', color: '#c9a84c', fontFamily: '"Cormorant Garamond", serif', margin: '0 0 0.5rem' }}>Current Focus</h3>
        <p style={{ fontSize: '0.9rem', color: 'rgba(232,223,200,0.8)', lineHeight: 1.4, margin: 0 }}>
          {personalizedRitual}
        </p>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
