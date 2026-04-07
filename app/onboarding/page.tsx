'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    healthGoal: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  if (!isLoaded || !user) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#05100a', color: '#e8dfc8', fontFamily: '"DM Sans", sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '500px', margin: '4rem auto', position: 'relative', zIndex: 1 }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#c9a84c', marginBottom: '0.5rem' }}>Welcome to your Journey</h1>
          <p style={{ opacity: 0.6 }}>Let VAIDYA know you better to personalize your healing.</p>
        </header>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(106, 191, 138, 0.2)', borderRadius: '24px', padding: '2.5rem', backdropFilter: 'blur(10px)' }}>
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#c9a84c' }}>What is your age?</h2>
              <input 
                type="number" 
                placeholder="Years"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1.1rem', marginBottom: '2rem' }}
              />
              <button 
                onClick={nextStep} 
                disabled={!formData.age}
                style={{ width: '100%', padding: '1rem', background: '#1a4d2e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', opacity: formData.age ? 1 : 0.5 }}
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#c9a84c' }}>How do you identify?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {['Female', 'Male', 'Non-binary', 'Other'].map(g => (
                  <button 
                    key={g} 
                    onClick={() => setFormData({ ...formData, gender: g })}
                    style={{ padding: '0.8rem', background: formData.gender === g ? 'rgba(106, 191, 138, 0.2)' : 'rgba(0,0,0,0.2)', border: `1px solid ${formData.gender === g ? '#6abf8a' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: 'white', cursor: 'pointer' }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={prevStep} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}>Back</button>
                <button 
                  onClick={nextStep} 
                  disabled={!formData.gender}
                  style={{ flex: 2, padding: '1rem', background: '#1a4d2e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', opacity: formData.gender ? 1 : 0.5 }}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#c9a84c' }}>What is your primary health goal?</h2>
              <textarea 
                placeholder="e.g. Better sleep, Managing stress, Digestive health..."
                value={formData.healthGoal}
                onChange={e => setFormData({ ...formData, healthGoal: e.target.value })}
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '1rem', height: '120px', marginBottom: '2rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={prevStep} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}>Back</button>
                <button 
                  onClick={handleSubmit} 
                  disabled={!formData.healthGoal || isSubmitting}
                  style={{ flex: 2, padding: '1rem', background: '#1a4d2e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', opacity: formData.healthGoal ? 1 : 0.5 }}
                >
                  {isSubmitting ? 'Saving...' : 'Finish →'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Progress bar */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: '40px', height: '4px', background: s <= step ? '#6abf8a' : 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
          ))}
        </div>
      </div>
    </main>
  );
}
