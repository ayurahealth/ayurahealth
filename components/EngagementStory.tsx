'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '../lib/constants';

const pages = [
  {
    title: "The Tale of Two Farmers",
    text: "In a lush valley, there lived two farmers, Harish and Arjun. Though their fields were adjacent, their harvests tells two different stories.",
    emoji: "🌿"
  },
  {
    title: "Harish: The Struggler",
    text: "Harish believed he could outsmart nature. He woke late, worked through the blistering midday heat, and ate heavy meals at midnight. He was always exhausted, and his crops withered.",
    emoji: "😫"
  },
  {
    title: "Arjun: The Wise",
    text: "Arjun rose before dawn (Brahma Muhurta). He worked during the cool morning Kapha hours and had his largest meal at noon when his digestive fire (Agni) was strongest.",
    emoji: "✨"
  },
  {
    title: "The Secret",
    text: "Harish asked for Arjun's secret. Arjun smiled: 'You try to command the sun. I simply listen to it. I am not working against the universe; I am flowing with it.'",
    emoji: "🤝"
  },
  {
    title: "Your Journey",
    text: "Ayurveda isn't just medicine; it's the art of listening to your internal rhythm. Today, VAIDYA helps you find your flow, just like Arjun.",
    emoji: "🕉️"
  }
];

export default function EngagementStory() {
  const [page, setPage] = useState(0);

  return (
    <div style={{
      width: '100%',
      maxWidth: '450px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      borderRadius: '24px',
      padding: '2rem',
      margin: '2rem auto',
      textAlign: 'center',
      backdropFilter: 'blur(10px)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{pages[page].emoji}</div>
          <h3 style={{ 
            fontFamily: '"Cormorant Garamond", serif', 
            fontSize: '1.8rem', 
            color: '#c9a84c',
            marginBottom: '1rem' 
          }}>
            {pages[page].title}
          </h3>
          <p style={{ 
            color: '#e8dfc8', 
            lineHeight: 1.6, 
            fontSize: '1rem',
            opacity: 0.8,
            minHeight: '100px'
          }}>
            {pages[page].text}
          </p>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', alignItems: 'center' }}>
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#c9a84c', 
            cursor: 'pointer',
            opacity: page === 0 ? 0.3 : 1
          }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {pages.map((_, i) => (
            <div key={i} style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: i === page ? '#c9a84c' : 'rgba(255,255,255,0.1)' 
            }} />
          ))}
        </div>

        <button 
          onClick={() => {
            if (page === pages.length - 1) setPage(0);
            else setPage(p => p + 1);
          }}
          style={{ 
            background: '#1a4d2e', 
            border: 'none', 
            color: 'white', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {page === pages.length - 1 ? "Start Journey" : "Next →"}
        </button>
      </div>
    </div>
  );
}
