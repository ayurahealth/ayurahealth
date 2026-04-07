'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

interface ClockSegment {
  dosha: DoshaType;
  start: number; // 24h
  end: number;
  label: string;
  recommendation: string;
  ritual: string;
  color: string;
  gradient: string;
}

const SEGMENTS: ClockSegment[] = [
  { dosha: 'Kapha', start: 6, end: 10, label: 'Early Morning', recommendation: 'Wake before sunrise. Exercise to break stagnation.', ritual: 'Abhyanga (Self-Massage)', color: '#6abf8a', gradient: 'linear-gradient(135deg, #1a4d2e, #6abf8a)' },
  { dosha: 'Pitta', start: 10, end: 14, label: 'Midday', recommendation: 'Strongest digestion. Have your largest meal now.', ritual: 'Principal Meal', color: '#c9a84c', gradient: 'linear-gradient(135deg, #8a6d1a, #c9a84c)' },
  { dosha: 'Vata', start: 14, end: 18, label: 'Afternoon', recommendation: 'High creativity. Light snack, avoid over-stimulation.', ritual: 'Creative Work', color: '#4a8a6a', gradient: 'linear-gradient(135deg, #0d2b1a, #4a8a6a)' },
  { dosha: 'Kapha', start: 18, end: 22, label: 'Evening', recommendation: 'Wind down. Light dinner, early sleep.', ritual: 'Evening Reflection', color: '#1a4d2e', gradient: 'linear-gradient(135deg, #05100a, #1a4d2e)' },
  { dosha: 'Pitta', start: 22, end: 2, label: 'Night', recommendation: 'Internal cleansing. Deep sleep is essential.', ritual: 'Deep Rest', color: '#8a6d1a', gradient: 'linear-gradient(135deg, #2b210a, #8a6d1a)' },
  { dosha: 'Vata', start: 2, end: 6, label: 'Pre-Dawn', recommendation: 'Subtle awareness. Best time for meditation.', ritual: 'Brahma Muhurta', color: '#0d2b1a', gradient: 'linear-gradient(135deg, #000000, #0d2b1a)' },
];

export default function AyurvedicClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
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

  const rotation = (decimalTime / 24) * 360;

  return (
    <div style={{
      width: '100%',
      maxWidth: '320px',
      background: 'rgba(5, 16, 10, 0.8)',
      padding: '2rem',
      borderRadius: '32px',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      textAlign: 'center',
      color: '#e8dfc8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      margin: '0 auto'
    }}>
      <div style={{ pointerEvents: 'none' }}>
        <h4 style={{ margin: 0, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#c9a84c' }}>Ayurvedic Rhythms</h4>
        <p style={{ margin: '0.2rem 0', fontSize: '1.2rem', fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}>{currentSegment.dosha} Era</p>
      </div>

      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          {SEGMENTS.map((s, i) => {
            const startAngle = (s.start / 24) * 360;
            const endAngle = (s.end / 24) * 360;
            const diff = (endAngle - startAngle + 360) % 360;
            const largeArc = diff > 180 ? 1 : 0;
            
            const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={s.dosha === currentSegment.dosha ? s.color : 'rgba(255,255,255,0.03)'}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
                style={{ transition: 'fill 0.5s ease' }}
              />
            );
          })}
          <circle cx="50" cy="50" r="35" fill="#05100a" />
          <motion.line
            x1="50" y1="50"
            x2={50 + 38 * Math.cos(((rotation - 90) * Math.PI) / 180)}
            y2={50 + 38 * Math.sin(((rotation - 90) * Math.PI) / 180)}
            stroke="#c9a84c"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="2.5" fill="#c9a84c" />
        </svg>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}</span>
          <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Now</span>
        </div>
      </div>

      <div style={{ textAlign: 'left', width: '100%', padding: '0 0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#c9a84c', fontWeight: 600 }}>🌟 Wisdom</p>
        <p style={{ margin: '0.3rem 0 0.8rem', fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.4 }}>{currentSegment.recommendation}</p>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: 0, fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Ritual</p>
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: '#6abf8a', fontWeight: 600 }}>{currentSegment.ritual}</p>
        </div>
      </div>
    </div>
  );
}
