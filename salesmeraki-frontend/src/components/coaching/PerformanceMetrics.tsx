'use client';

import { CoachingMetrics } from '@/types/coaching';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PerformanceMetricsProps {
  metrics: CoachingMetrics | null;
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Performance</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-semibold">{metrics.sessionsCompleted}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-semibold">{metrics.averageScore}%</p>
              </div>
              <div className="flex items-center">
                {metrics.improvement > 0 ? (
                  <ArrowUpIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-5 w-5 text-red-500" />
                )}
                <span className={metrics.improvement > 0 ? "text-green-500" : "text-red-500"}>
                  {Math.abs(metrics.improvement)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Key Strengths</h4>
          <ul className="space-y-2">
            {metrics.topStrengths.map((strength, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Areas to Improve</h4>
          <ul className="space-y-2">
            {metrics.topWeaknesses.map((weakness, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                <ClockIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-2">Recent Sessions</h4>
          {metrics.recentSessions.length > 0 ? (
            <div className="space-y-2">
              {metrics.recentSessions.map((session, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{session.type.charAt(0).toUpperCase() + session.type.slice(1)}</p>
                      <p className="text-gray-600">{new Date(session.startTime).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`h-2 w-2 rounded-full ${
                        session.status === 'completed' ? 'bg-green-500' : 
                        session.status === 'analyzing' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></span>
                      <span className="text-xs text-gray-600">{
                        session.status.charAt(0).toUpperCase() + session.status.slice(1)
                      }</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No recent sessions</p>
          )}
        </div>
      </div>
    </div>
  );
}