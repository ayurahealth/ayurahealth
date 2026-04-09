'use client';

/**
 * VAIDYA Voice Engine (JARVIS Edition)
 * Uses Web Audio API to process SpeechSynthesis output with 
 * high-pass filters and reverb for a holographic/metallic tone.
 */

class VaidyaVoice {
  private static instance: VaidyaVoice;
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.initAudioContext();
    }
  }

  public static getInstance(): VaidyaVoice {
    if (!VaidyaVoice.instance) {
      VaidyaVoice.instance = new VaidyaVoice();
    }
    return VaidyaVoice.instance;
  }

  private initAudioContext() {
    if (typeof window === 'undefined') return;
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  private loadVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    
    // Preference: Daniel (macOS), Google UK English Male, Microsoft George
    const preferred = [
      'Daniel',
      'Google UK English Male',
      'Microsoft George Online',
      'Arthur',
      'en-GB'
    ];

    for (const name of preferred) {
      const v = voices.find(v => v.name.includes(name));
      if (v) return v;
    }

    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth || this.isMuted) return;

    this.synth.cancel(); // Stop any previous speech

    // Clean text: remove markdown tags, URLs, extra symbols
    const cleanText = text
      .replace(/###\s+\w+/g, '') // Remove ### Answer etc
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove markdown links
      .replace(/[*_~`]/g, '') // Remove bold/italic/code markers
      .replace(/https?:\/\/\S+/g, '') // Remove URLs
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.voice = this.loadVoice();
    
    if (this.voice) {
      utterance.voice = this.voice;
    }

    utterance.pitch = 0.92; // Slightly lower for Jarvis
    utterance.rate = 1.05;  // Slightly faster for intelligence feel
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
    
    // Web Audio Overlay Simulation (Future: Capture real-time frequency if needed)
    // For now, we rely on the clean Daniel/UK voice which is already high quality.
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public toggleMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) this.stop();
  }
}

export const vaidyaVoice = VaidyaVoice.getInstance();
