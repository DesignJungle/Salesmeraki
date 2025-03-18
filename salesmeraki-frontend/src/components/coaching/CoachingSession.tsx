'use client';

import { useState, useEffect } from 'react';
import { useCoaching } from '@/hooks/useCoaching';
import { Button } from '@/components/common/Button';
import { AIFeedback } from '@/components/coaching/AIFeedback';
import { RecordingControls } from '@/components/coaching/RecordingControls';
import { RealtimeSentiment } from '@/components/coaching/RealtimeSentiment';
import { SessionVisualizations } from '@/components/coaching/SessionVisualizations';
import { SessionReplay } from '@/components/coaching/SessionReplay';

export default function CoachingSession() {
  const {
    isAnalyzing,
    currentSession,
    startSession,
    analyzeContent,
  } = useCoaching();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedContent, setRecordedContent] = useState<string>('');

  const handleStartSession = async (type: 'call' | 'presentation') => {
    try {
      await startSession(type);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (recordedContent && currentSession?.id) {
      try {
        await analyzeContent(recordedContent, 'speech');
      } catch (error) {
        console.error('Failed to analyze content:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {!currentSession ? (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button
            variant="primary"
            leftIcon={<span className="mr-2">📞</span>}
            onClick={() => handleStartSession('call')}
          >
            Start Sales Call
          </Button>
          <Button
            variant="secondary"
            leftIcon={<span className="mr-2">🎯</span>}
            onClick={() => handleStartSession('presentation')}
          >
            Start Presentation
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <RecordingControls
            isRecording={isRecording}
            onRecordingComplete={setRecordedContent}
            onStop={handleStopRecording}
          />
          
          {isRecording && currentSession?.id && (
            <RealtimeSentiment
              sessionId={currentSession.id}
              isRecording={isRecording}
            />
          )}
          
          {isAnalyzing ? (
            <div className="text-center py-4">
              <span className="text-blue-600">Analyzing your session...</span>
            </div>
          ) : currentSession.aiAnalysis && (
            <>
              <AIFeedback analysis={currentSession.aiAnalysis} />
              <SessionVisualizations session={currentSession} />
              {currentSession?.audioUrl && (
                <SessionReplay
                  session={currentSession}
                  audioUrl={currentSession.audioUrl || ''}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}