'use client';

import { useState, useRef, useEffect } from 'react';
import { saveResponse } from '@/lib/actions';

interface AudioRecorderProps {
  lessonId: string;
}

export default function AudioRecorder({ lessonId }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const startTime = useRef<number>(0);
  const timerInterval = useRef<number | undefined>(undefined);

  // Cleanup URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      startTime.current = Date.now();

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAudioData(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      timerInterval.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTime.current) / 1000;
        setDuration(elapsed);
      }, 100);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  }

  function stopRecording() {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerInterval.current) {
        window.clearInterval(timerInterval.current);
      }
    }
  }

  async function handleSubmit() {
    if (!audioData) return;

    setIsSaving(true);
    try {
      const response = await saveResponse({
        lessonId,
        sectionId: 'speaking',
        content: JSON.stringify({
          audio: audioData,
          duration: duration,
        }),
      });

      if (response.success) {
        setShowFeedback(true);
        // Reset for next recording
        setAudioURL(null);
        setAudioData(null);
        setDuration(0);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={!!audioURL}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
          >
            Stop Recording
          </button>
        )}
        <span className='text-sm text-gray-600'>{duration.toFixed(1)}s</span>
      </div>

      {audioURL && (
        <div className='space-y-4'>
          <div className='bg-white rounded-lg p-2 border border-gray-200'>
            <audio
              src={audioURL}
              controls
              className='w-full h-8'
              controlsList='nodownload noplaybackrate'
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className='w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {isSaving ? 'Saving...' : 'Save Recording'}
          </button>
        </div>
      )}

      {showFeedback && (
        <div className='p-4 bg-green-50 text-green-800 rounded-md'>
          Your recording has been saved successfully!
        </div>
      )}
    </div>
  );
}
