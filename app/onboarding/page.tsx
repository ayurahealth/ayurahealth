'use client';


import React, { useState, useEffect } from 'react';
import { useSafeUser as useUser } from '@/lib/clerk-client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiUrl } from '@/lib/constants';
import { 
  Heart, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  User,
  Users,
  Compass,
  Activity
} from 'lucide-react';

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    vataScore: 0,
    pittaScore: 0,
    kaphaScore: 0,
    primaryDosha: '' as string,
    healthGoal: '',
    conditions: [] as string[],
    acceptedTerms: false,
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
      const res = await fetch(getApiUrl('/api/user-profile'), {
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

  const totalSteps = 6;

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg-main)', color: 'var(--text-main)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '2rem auto', position: 'relative' }}>
        
        {/* Progress Stepper */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'flex-end' }}>
            <div>
              <span style={{ color: 'var(--accent-main)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Phase 01</span>
              <div style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600 }}>Clinical Intake</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--surface-mid)', borderRadius: 10, overflow: 'hidden', display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div 
                key={s} 
                style={{ 
                  flex: 1, 
                  height: '100%', 
                  background: s <= step ? 'var(--accent-main)' : 'var(--border-mid)',
                  transition: 'background 0.4s ease'
                }} 
              />
            ))}
          </div>
        </div>

        <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ marginBottom: '1rem', color: 'var(--accent-main)' }}
          >
            <Compass size={40} />
          </motion.div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: 500 }}>
            Welcome to the Sanctuary
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            Personalize VAIDYA&apos;s synthesis by defining your current baseline.
          </p>
        </header>

        <div className="glass-surface" style={{ padding: '2.5rem', borderRadius: '28px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <User size={20} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Biological Age</h2>
                </div>
                <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                  <input 
                    type="number" 
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '1.25rem', 
                      background: 'var(--bg-main)', 
                      border: '1px solid var(--border-mid)', 
                      borderRadius: '16px', 
                      color: 'var(--text-main)', 
                      fontSize: '1.25rem',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                  <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 500 }}>Years</div>
                </div>
                
                <button 
                  onClick={nextStep} 
                  disabled={!formData.age}
                  className="btn-primary"
                  style={{ width: '100%', height: 56, opacity: formData.age ? 1 : 0.4 }}
                >
                  Continue
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <Users size={20} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Biological Identity</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
                  {['Female', 'Male', 'Non-binary', 'Other'].map(g => (
                    <button 
                      key={g} 
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className="flat-card"
                      style={{ 
                        padding: '1.25rem', 
                        background: formData.gender === g ? 'hsla(var(--accent-main-hsl), 0.1)' : 'var(--bg-main)', 
                        border: `1px solid ${formData.gender === g ? 'var(--accent-main)' : 'var(--border-low)'}`, 
                        borderRadius: '16px', 
                        color: formData.gender === g ? 'var(--accent-main)' : 'var(--text-muted)', 
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={prevStep} style={{ flex: 1, height: 56, background: 'none', border: '1px solid var(--border-low)', borderRadius: 16, color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.gender}
                    className="btn-primary"
                    style={{ flex: 2, height: 56, opacity: formData.gender ? 1 : 0.4 }}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <Sparkles size={20} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Nature & Constitution</h2>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Select the trait that most accurately describes your natural state.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                  {[
                    { id: 'Vata', label: 'I am creative, energetic, and often feel cool or dry.', desc: 'High Vata tendencies' },
                    { id: 'Pitta', label: 'I am focused, intensive, and tend to feel warm easily.', desc: 'High Pitta tendencies' },
                    { id: 'Kapha', label: 'I am calm, steady, and have strong physical endurance.', desc: 'High Kapha tendencies' }
                  ].map(d => (
                    <button 
                      key={d.id} 
                      onClick={() => {
                        const scores = { vataScore: 20, pittaScore: 20, kaphaScore: 20 };
                        if (d.id === 'Vata') scores.vataScore = 60;
                        if (d.id === 'Pitta') scores.pittaScore = 60;
                        if (d.id === 'Kapha') scores.kaphaScore = 60;
                        setFormData({ ...formData, ...scores, primaryDosha: d.id });
                        nextStep();
                      }}
                      className="flat-card"
                      style={{ 
                        padding: '1.5rem', 
                        background: 'var(--bg-main)', 
                        border: '1px solid var(--border-low)', 
                        borderRadius: '16px', 
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{d.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent-main)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.desc}</div>
                    </button>
                  ))}
                </div>
                
                <button onClick={prevStep} style={{ width: '100%', height: 56, background: 'none', border: '1px solid var(--border-low)', borderRadius: 16, color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <Heart size={20} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Primary Health Focus</h2>
                </div>
                <textarea 
                  placeholder="e.g. Managing metabolic health, improving sleep quality, optimizing hormone balance..."
                  value={formData.healthGoal}
                  onChange={e => setFormData({ ...formData, healthGoal: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '1.25rem', 
                    background: 'var(--bg-main)', 
                    border: '1px solid var(--border-mid)', 
                    borderRadius: '16px', 
                    color: 'var(--text-main)', 
                    fontSize: '1rem', 
                    height: '160px', 
                    marginBottom: '2.5rem',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: 1.6
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={prevStep} style={{ flex: 1, height: 56, background: 'none', border: '1px solid var(--border-low)', borderRadius: 16, color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.healthGoal}
                    className="btn-primary"
                    style={{ flex: 2, height: 56, opacity: formData.healthGoal ? 1 : 0.4 }}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <Activity size={20} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Existing Conditions</h2>
                </div>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  Select any diagnosed conditions to help VAIDYA calibrate your protocol recommendations.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    'PCOS / PCOD', 
                    'Insomnia', 
                    'Type 2 Diabetes', 
                    'Hypertension', 
                    'Hypo/Hyperthyroid', 
                    'Digestive Issues', 
                    'Chronic Fatigue',
                    'None / Preventative'
                  ].map(condition => {
                    const isSelected = formData.conditions.includes(condition);
                    return (
                      <button
                        key={condition}
                        onClick={() => {
                          if (condition === 'None / Preventative') {
                            setFormData({ ...formData, conditions: ['None / Preventative'] });
                          } else {
                            const newConditions = isSelected
                              ? formData.conditions.filter(c => c !== condition)
                              : [...formData.conditions.filter(c => c !== 'None / Preventative'), condition];
                            setFormData({ ...formData, conditions: newConditions });
                          }
                        }}
                        style={{
                          padding: '0.75rem 1.25rem',
                          borderRadius: '12px',
                          background: isSelected ? 'hsla(var(--accent-main-hsl), 0.15)' : 'var(--bg-main)',
                          border: `1px solid ${isSelected ? 'var(--accent-main)' : 'var(--border-low)'}`,
                          color: isSelected ? 'var(--accent-main)' : 'var(--text-main)',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {condition}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={prevStep} style={{ flex: 1, height: 56, background: 'none', border: '1px solid var(--border-low)', borderRadius: 16, color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                  <button 
                    onClick={nextStep} 
                    disabled={formData.conditions.length === 0}
                    className="btn-primary"
                    style={{ flex: 2, height: 56, opacity: formData.conditions.length > 0 ? 1 : 0.4 }}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div 
                key="step6"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent-secondary)' }}>
                  <ShieldAlert size={20} />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Protocol Affirmation</h2>
                </div>
                
                <div style={{ background: 'hsla(var(--accent-secondary-hsl), 0.05)', border: '1px solid hsla(var(--accent-secondary-hsl), 0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
                  <p style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: 'var(--accent-secondary)' }}>INTELLIGENCE DISCLAIMER:</strong> Ayura Intelligence Lab provides research synthesis based on verified traditional bio-energetic principles.
                  </p>
                  <p>
                    It is <strong style={{ color: 'var(--text-main)' }}>not a medical device</strong> and does not provide clinical diagnosis or treatment. Always consult a licensed physician for medical decisions.
                  </p>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', marginBottom: '2.5rem', padding: '0.5rem' }}>
                  <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0, marginTop: 2 }}>
                    <input 
                      type="checkbox" 
                      checked={formData.acceptedTerms}
                      onChange={e => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                      style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }}
                    />
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: '6px', 
                      background: formData.acceptedTerms ? 'var(--accent-main)' : 'var(--bg-main)', 
                      border: `2px solid ${formData.acceptedTerms ? 'var(--accent-main)' : 'var(--border-mid)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {formData.acceptedTerms && <ArrowRight size={14} color="var(--bg-main)" strokeWidth={3} />}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    I understand that VAIDYA AI provides educational data synthesis only and is not a substitute for professional medical advice.
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={prevStep} style={{ flex: 1, height: 56, background: 'none', border: '1px solid var(--border-low)', borderRadius: 16, color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={!formData.acceptedTerms || isSubmitting}
                    className="btn-primary"
                    style={{ flex: 2, height: 56, opacity: formData.acceptedTerms ? 1 : 0.4 }}
                  >
                    {isSubmitting ? 'Processing...' : 'Finalize & Sync →'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.5 }}>
          Authorized Clinical Intake Area — SECURE_SSL_ACTIVE
        </p>
      </div>
    </main>
  );
}
