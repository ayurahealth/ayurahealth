'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    scores: { vata: number; pitta: number; kapha: number };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'frame',
    text: 'How would you describe your physical frame?',
    options: [
      { label: 'Slender, thin, easily lose weight', scores: { vata: 3, pitta: 1, kapha: 0 } },
      { label: 'Medium, athletic, gain/lose easily', scores: { vata: 1, pitta: 3, kapha: 1 } },
      { label: 'Large, solid, gain weight easily', scores: { vata: 0, pitta: 1, kapha: 3 } },
    ]
  },
  {
    id: 'skin',
    text: 'What is your skin like usually?',
    options: [
      { label: 'Dry, rough, thin, or cool', scores: { vata: 3, pitta: 0, kapha: 1 } },
      { label: 'Oily, sensitive, prone to redness', scores: { vata: 0, pitta: 3, kapha: 1 } },
      { label: 'Thick, moist, smooth, and cool', scores: { vata: 0, pitta: 0, kapha: 3 } },
    ]
  },
  {
    id: 'energy',
    text: 'How is your energy level through the day?',
    options: [
      { label: 'Bursts of energy, but tires easily', scores: { vata: 3, pitta: 1, kapha: 0 } },
      { label: 'Steady, strong, competitive', scores: { vata: 1, pitta: 3, kapha: 1 } },
      { label: 'Slow but lasting, calm', scores: { vata: 0, pitta: 1, kapha: 3 } },
    ]
  },
  {
    id: 'mind',
    text: 'In stressful situations, how do you react?',
    options: [
      { label: 'Anxious, worried, or fearful', scores: { vata: 3, pitta: 0, kapha: 0 } },
      { label: 'Irritable, angry, or impatient', scores: { vata: 0, pitta: 3, kapha: 1 } },
      { label: 'Withdrawn, stubborn, or calm', scores: { vata: 0, pitta: 1, kapha: 3 } },
    ]
  },
  {
    id: 'digestion',
    text: 'Describe your digestion and appetite.',
    options: [
      { label: 'Irregular, gassy, variable appetite', scores: { vata: 3, pitta: 0, kapha: 0 } },
      { label: 'Strong, intense hunger, acidic', scores: { vata: 0, pitta: 3, kapha: 0 } },
      { label: 'Slow, heavy, can skip meals easily', scores: { vata: 0, pitta: 0, kapha: 3 } },
    ]
  }
];

export default function DoshaQuiz({ onComplete }: { onComplete: (scores: { vata: number; pitta: number; kapha: number }) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ vata: 0, pitta: 0, kapha: 0 });
  const [isFinishing, setIsFinishing] = useState(false);

  const handleSelect = (optionScores: { vata: number; pitta: number; kapha: number }) => {
    const newScores = {
      vata: scores.vata + optionScores.vata,
      pitta: scores.pitta + optionScores.pitta,
      kapha: scores.kapha + optionScores.kapha,
    };
    setScores(newScores);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setIsFinishing(true);
      onComplete(newScores);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#6abf8a', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Question {currentQ + 1} of {QUESTIONS.length}
            </span>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.8rem', color: '#c9a84c', marginTop: '0.5rem' }}>
              {QUESTIONS[currentQ].text}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {QUESTIONS[currentQ].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt.scores)}
                disabled={isFinishing}
                style={{
                  padding: '1.25rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(106,191,138,0.2)',
                  borderRadius: 16,
                  color: '#e8dfc8',
                  fontSize: '1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(106,191,138,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(106,191,138,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(106,191,138,0.2)';
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '3rem', height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
        <motion.div 
          style={{ height: '100%', background: '#6abf8a', borderRadius: 2 }}
          animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
