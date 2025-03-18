export interface CoachingMetrics {
  sessionsCompleted: number;
  averageScore: number;
  improvement: number;
  recentSessions: CoachingActivity[];
  topStrengths: string[];
  topWeaknesses: string[];
}

export interface SentimentMetrics {
  overall: number;
  confidence: number;
  engagement: number;
  segments: SentimentSegment[];
}

export interface SentimentSegment {
  timestamp: string;
  duration: number;
  sentiment: number;
  keywords: string[];
}

export interface SpeechPatternAnalysis {
  pace: number;
  clarity: number;
  fillerWords: {
    word: string;
    count: number;
  }[];
  keyPhrases: {
    phrase: string;
    frequency: number;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface CoachingActivity {
  id: string;
  type: 'call' | 'presentation' | 'meeting';
  startTime: string;
  endTime?: string;
  status: 'in-progress' | 'completed' | 'analyzing';
  aiAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    sentiment: {
      overall: number;
      timeline: Array<{ time: number; score: number }>;
    };
    metrics: {
      talkRatio: number;
      paceWpm: number;
      keyPhrases: string[];
    };
  };
  metadata: Record<string, any>;
}

export interface SkillAssessment {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  progress: number;
  lastAssessed: string;
}

export interface CoachingGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: 'active' | 'completed' | 'overdue';
  metrics: Record<string, number>;
}
