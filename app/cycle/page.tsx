'use client';

import React, { useState, useEffect } from 'react';
import { SafeSignInButton as SignInButton, useSafeUser as useUser } from '@/lib/clerk-client';
import { motion, AnimatePresence } from 'framer-motion';
import AyurvedicCycle from '../../components/AyurvedicCycle';
import DoshaQuiz from '../../components/DoshaQuiz';
import { useRouter } from 'next/navigation';

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
      const res = await fetch('/api/user-profile');
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
    // Determine primary dosha
    const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
    let primary = 'Vata';
    if (scores.pitta === maxScore) primary = 'Pitta';
    if (scores.kapha === maxScore) primary = 'Kapha';

    try {
      const res = await fetch('/api/user-profile', {
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
      <div style={{ minHeight: '100vh', background: '#05100a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse-loader" style={{ width: 40, height: 40, border: '2px solid #6abf8a', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#05100a', color: '#e8dfc8', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Background Ambience */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% -20%, rgba(26,77,46,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 1 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌿</span>
            <span style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.9rem' }}>AYURA INTELLIGENCE</span>
          </div>
          {user ? (
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Hi, {user.firstName}</div>
          ) : (
            <SignInButton mode="modal">
              <button style={{ background: 'none', border: 'none', color: '#6abf8a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
            </SignInButton>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div key="guest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', color: '#c9a84c', marginBottom: '1rem' }}>Your Universal Rhythm</h1>
              <p style={{ opacity: 0.6, marginBottom: '2.5rem' }}>Ancient Ayurveda teaches us that the universe and our bodies follow a synchronized 24-hour cycle.</p>
              <AyurvedicCycle />
              <div style={{ marginTop: '3rem' }}>
                <SignInButton mode="modal">
                  <button style={{ padding: '1rem 2rem', background: '#1a4d2e', color: 'white', border: 'none', borderRadius: 980, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 30px rgba(26,77,46,0.3)' }}>Sign In to Personalize</button>
                </SignInButton>
              </div>
            </motion.div>
          ) : showQuiz ? (
            <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: 24, padding: '2rem', backdropFilter: 'blur(20px)' }}>
                <DoshaQuiz onComplete={handleQuizComplete} />
                <button onClick={() => setShowQuiz(false)} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', color: '#c9a84c', margin: '0 0 0.5rem' }}>My Living Rhythm</h1>
                <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>Aligning your {profile?.primaryDosha || 'constitution'} with the sun.</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 32, padding: '2.5rem 1rem', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <AyurvedicCycle userDosha={profile?.primaryDosha} />
              </div>

              {!profile?.primaryDosha && (
                <div style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(106,191,138,0.1), transparent)', border: '1px solid rgba(106,191,138,0.2)', borderRadius: 24, textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#6abf8a', marginBottom: '0.5rem' }}>Unlock Personalized Wisdom</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>VAIDYA can calculate your unique Dosha constitution to provide specific rituals for your type.</p>
                  <button onClick={() => setShowQuiz(true)} style={{ padding: '0.8rem 1.5rem', background: '#6abf8a', color: '#05100a', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Generate My Cycle →</button>
                </div>
              )}

              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.4, marginBottom: '1rem' }}>TIP: Save this page to your Home Screen for daily access</div>
                <button onClick={() => router.push('/chat')} style={{ background: 'none', border: '1px solid rgba(106,191,138,0.3)', color: '#6abf8a', padding: '0.75rem 1.5rem', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Consult VAIDYA</button>
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
