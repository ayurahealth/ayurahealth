import { useState, useRef, useCallback } from 'react';

export interface AudioRecorderHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioBlob: Blob | null;
  audioUrl: string | null;
  analyser: AnalyserNode | null;
}

export const useAudioRecorder = (): AudioRecorderHook => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup AudioContext for visualization
      const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
      const AudioContextCtor = audioWindow.AudioContext || audioWindow.webkitAudioContext
      if (!AudioContextCtor) {
        throw new Error('AudioContext is not supported in this browser')
      }

      const audioContext = new AudioContextCtor();
      const source = audioContext.createMediaStreamSource(stream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;
      source.connect(analyserNode);
      
      audioContextRef.current = audioContext;
      setAnalyser(analyserNode);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    audioUrl,
    analyser
  };
};
