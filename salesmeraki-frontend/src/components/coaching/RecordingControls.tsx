'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/common/Button';
import { MicrophoneIcon, StopIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/solid';

interface RecordingControlsProps {
  isRecording: boolean;
  onRecordingComplete: (content: string) => void;
  onStop: () => void;
}

export function RecordingControls({ 
  isRecording, 
  onRecordingComplete, 
  onStop 
}: RecordingControlsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && isRecording) {
      // @ts-ignore - SpeechRecognition is not in the standard TS types
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          setTranscript(prev => prev + finalTranscript);
        };
        
        recognitionRef.current.start();
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  // Timer for recording duration
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
    
    if (recognitionRef.current) {
      if (!isPaused) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    onRecordingComplete(transcript);
    onStop();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-3 w-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
          <span className="font-medium">{isPaused ? 'Paused' : 'Recording'}</span>
          <span className="text-gray-500">{formatTime(recordingTime)}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handlePauseResume}
            variant="secondary"
            size="sm"
          >
            {isPaused ? (
              <PlayIcon className="h-5 w-5 mr-1" />
            ) : (
              <PauseIcon className="h-5 w-5 mr-1" />
            )}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            onClick={handleStop}
            variant="danger"
            size="sm"
          >
            <StopIcon className="h-5 w-5 mr-1" />
            Stop
          </Button>
        </div>
      </div>
      
      {transcript && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md max-h-32 overflow-y-auto">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
}