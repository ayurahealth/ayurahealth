'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, BookOpen, Sun, MessageSquare, Compass } from 'lucide-react';

const pages = [
  {
    title: "The Tale of Two Farmers",
    text: "In a lush valley, there lived two farmers, Harish and Arjun. Though their fields were adjacent, their harvests told two different stories.",
    icon: <BookOpen size={48} className="text-secondary" />
  },
  {
    title: "Harish: The Struggler",
    text: "Harish believed he could outsmart nature. He worked through the blistering midday heat and ate heavy meals at midnight. He was always exhausted, and his crops withered.",
    icon: <Compass size={48} style={{ color: 'var(--accent-secondary)' }} />
  },
  {
    title: "Arjun: The Wise",
    text: "Arjun rose before dawn (Brahma Muhurta). He worked during the cool morning Kapha hours and had his largest meal at noon when his digestive fire (Agni) was strongest.",
    icon: <Sun size={48} style={{ color: 'var(--accent-main)' }} />
  },
  {
    title: "The Secret",
    text: "Harish asked for Arjun's secret. Arjun smiled: 'You try to command the sun. I simply listen to it. I am not working against the universe; I am flowing with it.'",
    icon: <MessageSquare size={48} className="text-main" />
  },
  {
    title: "Your Journey",
    text: "Ayurveda isn't just medicine; it's the art of listening to your internal rhythm. Today, VAIDYA helps you find your flow, just like Arjun.",
    icon: <Sparkles size={48} style={{ color: 'var(--accent-main)' }} />
  }
];

export default function EngagementStory() {
  const [page, setPage] = useState(0);

  return (
    <div 
      className="glass-surface"
      style={{
        width: '100%',
        maxWidth: '500px',
        padding: '2.5rem',
        margin: '2rem auto',
        textAlign: 'center',
        background: 'var(--surface-mid)',
        borderRadius: '24px'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "circOut" }}
          style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ marginBottom: '1.5rem', color: 'var(--accent-main)' }}>
            {pages[page].icon}
          </div>
          <h3 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.75rem', 
            color: 'var(--text-main)',
            marginBottom: '1rem',
            fontWeight: 500
          }}>
            {pages[page].title}
          </h3>
          <p style={{ 
            color: 'var(--text-muted)', 
            lineHeight: 1.7, 
            fontSize: '1rem',
            opacity: 0.9,
            fontWeight: 400
          }}>
            {pages[page].text}
          </p>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', alignItems: 'center' }}>
        <button 
          onClick={() => setPage(p => Math.max(0, p - 1))}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-muted)', 
            cursor: 'pointer',
            opacity: page === 0 ? 0.2 : 0.6,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            padding: '0.5rem'
          }}
          disabled={page === 0}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {pages.map((_, i) => (
            <div key={i} style={{ 
              width: i === page ? '24px' : '6px', 
              height: '6px', 
              borderRadius: '3px', 
              background: i === page ? 'var(--accent-main)' : 'var(--border-mid)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>

        {page === pages.length - 1 ? (
          <button 
            onClick={() => setPage(0)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-main)', 
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Replay
          </button>
        ) : (
          <button 
            onClick={() => setPage(p => p + 1)}
            style={{ 
              background: 'var(--accent-main)', 
              border: 'none', 
              color: 'var(--bg-main)', 
              padding: '0.6rem 1rem', 
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.9rem'
            }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
