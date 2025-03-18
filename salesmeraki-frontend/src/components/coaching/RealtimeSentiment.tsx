'use client';

import { useState, useEffect } from 'react';
import { useRealtimeCoaching } from '@/hooks/useRealtimeCoaching';

interface RealtimeSentimentProps {
  sessionId: string;
  isRecording: boolean;
}

export function RealtimeSentiment({ sessionId, isRecording }: RealtimeSentimentProps) {
  const { realtimeInsights } = useRealtimeCoaching(sessionId);
  const [keyPhrases, setKeyPhrases] = useState<string[]>([]);

  useEffect(() => {
    if (realtimeInsights?.keywords && realtimeInsights.keywords.length > 0) {
      setKeyPhrases(prev => [...prev, ...realtimeInsights.keywords].slice(-5));
    }
  }, [realtimeInsights]);

  if (!isRecording) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-md font-medium text-gray-900 mb-3">Real-time Feedback</h3>
      
      {realtimeInsights ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Sentiment</p>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                realtimeInsights.sentiment > 0.6 ? 'bg-green-500' : 
                realtimeInsights.sentiment < 0.4 ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium">
                {realtimeInsights.sentiment > 0.6 ? 'Positive' : 
                 realtimeInsights.sentiment < 0.4 ? 'Negative' : 'Neutral'}
              </span>
            </div>
          </div>
          
          {keyPhrases.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Key Phrases</p>
              <div className="flex flex-wrap gap-2">
                {keyPhrases.map((phrase, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Analyzing your conversation...</div>
      )}
    </div>
  );
}
