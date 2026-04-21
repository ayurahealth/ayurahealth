'use client';

import React, { useState, useEffect } from 'react';
import { SafeSignInButton as SignInButton, useSafeUser as useUser } from '@/lib/clerk-client';
import { motion, AnimatePresence } from 'framer-motion';
import AyurvedicCycle from '../../components/AyurvedicCycle';
import DoshaQuiz from '../../components/DoshaQuiz';
import { useRouter } from 'next/navigation';
import Nav from '../../components/Nav';
import Surface from '../../components/ui/Surface';
import { getApiUrl } from '@/lib/constants';

interface UserProfile {
  id: string;
  email: string;
  primaryDosha?: string;
  vataScore?: number;
  pittaScore?: number;
  kaphaScore?: number;
  age?: number;
  gender?: string;
  healthGoal?: string;
}

export default function CyclePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchProfile();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(getApiUrl('/api/user-profile'));
      const data = await res.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (scores: { vata: number; pitta: number; kapha: number }) => {
    const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
    let primary = 'Vata';
    if (scores.pitta === maxScore) primary = 'Pitta';
    if (scores.kapha === maxScore) primary = 'Kapha';

    try {
      const res = await fetch(getApiUrl('/api/user-profile'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryDosha: primary,
          vataScore: scores.vata,
          pittaScore: scores.pitta,
          kaphaScore: scores.kapha,
        }),
      });
      if (res.ok) {
        await fetchProfile();
        setShowQuiz(false);
      }
    } catch (err) {
      console.error('Save quiz error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '2px solid var(--accent-main)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', position: 'relative', overflowX: 'hidden' }}>
      <Nav />
      {/* Background Ambience */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% -20%, hsla(var(--accent-main-hsl), 0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'max(15vh, 10rem) 1.5rem 4rem', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div key="guest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
              <h1 className="hero-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--accent-secondary)', marginBottom: '1rem', fontWeight: 600 }}>Your Universal Rhythm</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 4rem', lineHeight: 1.6 }}>Ancient Ayurveda teaches us that the universe and our bodies follow a synchronized 24-hour cycle.</p>
              
              <Surface variant="glass" style={{ padding: '3rem 1rem', display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <AyurvedicCycle />
              </Surface>

              <SignInButton mode="modal">
                <button className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Personalize Your Rhythm</button>
              </SignInButton>
            </motion.div>
          ) : showQuiz ? (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <Surface variant="glass" style={{ padding: '3rem' }}>
                <DoshaQuiz onComplete={handleQuizComplete} />
                <button onClick={() => setShowQuiz(false)} style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Cancel Evaluation</button>
              </Surface>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="hero-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--accent-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>My Living Rhythm</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Aligning your {profile?.primaryDosha || 'constitution'} with the celestial arc.</p>
              </div>

              <Surface variant="glass" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <AyurvedicCycle userDosha={profile?.primaryDosha} />
              </Surface>

              {!profile?.primaryDosha && (
                <Surface style={{ padding: '3rem', textAlign: 'center', background: 'hsla(var(--accent-main-hsl), 0.05)', border: '1px solid var(--border-mid)' }}>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-main)', marginBottom: '1rem' }}>Unlock Personalized Wisdom</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 500, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>VAIDYA can calculate your unique Dosha constitution to provide specific rituals for your type.</p>
                  <button onClick={() => setShowQuiz(true)} className="btn-primary">Initialize Evaluation →</button>
                </Surface>
              )}

              <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem', opacity: 0.5 }}>AUTHORIZED CLINICAL INTENSITY: OPTIMAL</p>
                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                  <button className="btn-secondary" onClick={() => router.push('/chat')}>Consult VAIDYA</button>
                  <button className="btn-secondary" onClick={() => router.push('/dashboard')}>View Dashboard</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
