import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';

export function useRealtimeCoaching(sessionId: string) {
  const [realtimeInsights, setRealtimeInsights] = useState<{
    sentiment: number;
    keywords: string[];
    suggestions: string[];
  } | null>(null);

  const ws = useWebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/coaching/${sessionId}`);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeInsights(data);
    };

    return () => {
      ws.close();
    };
  }, [ws, sessionId]);

  return { realtimeInsights };
}