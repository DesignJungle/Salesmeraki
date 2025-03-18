import { useState, useCallback } from 'react';
import { CoachingMetrics, CoachingActivity } from '@/types/coaching';

export function useCoaching() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSession, setCurrentSession] = useState<CoachingActivity | null>(null);
  const [metrics, setMetrics] = useState<CoachingMetrics | null>(null);

  const startSession = useCallback(async (type: CoachingActivity['type']) => {
    try {
      const response = await fetch('/api/coaching/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const session = await response.json();
      setCurrentSession(session);
      return session;
    } catch (error) {
      console.error('Failed to start coaching session:', error);
      throw error;
    }
  }, []);

  const analyzeContent = useCallback(async (content: string, type: 'speech' | 'text' | 'video') => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/coaching/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession?.id,
          content: { type, data: content },
        }),
      });
      const analysis = await response.json();
      setCurrentSession(prev => prev ? { ...prev, aiAnalysis: analysis } : null);
      return analysis;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentSession]);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/coaching/metrics');
      const data = await response.json();
      setMetrics(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch coaching metrics:', error);
      throw error;
    }
  }, []);

  return {
    isAnalyzing,
    currentSession,
    metrics,
    startSession,
    analyzeContent,
    fetchMetrics,
  };
}