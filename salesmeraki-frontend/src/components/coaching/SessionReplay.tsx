'use client';

import { useState, useRef, useEffect } from 'react';
import { CoachingActivity } from '@/types/coaching';
import { 
  PlayIcon, 
  PauseIcon, 
  BackwardIcon, 
  ForwardIcon 
} from '@heroicons/react/24/solid';

interface SessionReplayProps {
  session: CoachingActivity;
  audioUrl: string;
}

export function SessionReplay({ session, audioUrl }: SessionReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Session Replay</h3>
      
      <audio ref={audioRef} src={audioUrl} className="hidden" />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
          <span className="text-sm text-gray-600">{formatTime(duration)}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        
        <div className="flex items-center justify-center space-x-4">
          <button 
            onClick={skipBackward}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <BackwardIcon className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={togglePlayPause}
            className="p-3 bg-blue-600 rounded-full text-white hover:bg-blue-700"
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>
          
          <button 
            onClick={skipForward}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ForwardIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">Session Details</p>
        <p>Type: {session.type.charAt(0).toUpperCase() + session.type.slice(1)}</p>
        <p>Date: {new Date(session.startTime).toLocaleDateString()}</p>
        <p>Duration: {session.endTime ? 
          formatTime((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000) : 
          'In progress'}
        </p>
      </div>
    </div>
  );
}