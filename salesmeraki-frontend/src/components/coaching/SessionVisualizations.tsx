'use client';

import { useState } from 'react';
import { CoachingActivity } from '@/types/coaching';
import { Tab } from '@headlessui/react';
import { ChartBarIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SessionVisualizationsProps {
  session: CoachingActivity;
}

export function SessionVisualizations({ session }: SessionVisualizationsProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  
  if (!session.aiAnalysis) return null;
  
  const { sentiment, metrics } = session.aiAnalysis;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Session Analytics</h3>
      
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected ? 'bg-white shadow text-blue-700' : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'}`
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <ChartBarIcon className="h-5 w-5" />
              <span>Sentiment</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected ? 'bg-white shadow text-blue-700' : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'}`
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <span>Speech Metrics</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected ? 'bg-white shadow text-blue-700' : 'text-gray-700 hover:bg-white/[0.12] hover:text-blue-600'}`
            }
          >
            <div className="flex items-center justify-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span>Timeline</span>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel className="rounded-xl p-3">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Sentiment</p>
                <div className="flex items-center space-x-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getSentimentColor(sentiment.overall)}`} 
                      style={{ width: `${Math.max(Math.min(sentiment.overall * 100, 100), 0)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{Math.round(sentiment.overall * 100)}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Positive Language</p>
                  <p className="text-2xl font-semibold">{Math.round(sentiment.overall * 100)}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Customer Engagement</p>
                  <p className="text-2xl font-semibold">Medium</p>
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="rounded-xl p-3">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Talk Ratio</p>
                  <p className="text-2xl font-semibold">{metrics.talkRatio}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.talkRatio > 60 ? 'Try to listen more' : 'Good balance'}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Speaking Pace</p>
                  <p className="text-2xl font-semibold">{metrics.paceWpm} wpm</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.paceWpm > 160 ? 'Try to slow down' : 
                     metrics.paceWpm < 120 ? 'Could be more engaging' : 'Good pace'}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Key Phrases Used</p>
                <div className="flex flex-wrap gap-2">
                  {metrics.keyPhrases.map((phrase, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="rounded-xl p-3">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Sentiment Over Time</p>
              <div className="h-40 w-full bg-gray-50 rounded-lg p-2 flex items-end space-x-1">
                {sentiment.timeline.map((point, index) => (
                  <div 
                    key={index}
                    className={`w-full ${getSentimentColor(point.score)}`}
                    style={{ 
                      height: `${Math.max(Math.min(point.score * 100, 100), 5)}%`,
                      transition: 'height 0.3s ease'
                    }}
                    title={`${Math.round(point.time)}s: ${Math.round(point.score * 100)}%`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">Time (seconds)</p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.7) return 'bg-green-500';
  if (sentiment >= 0.4) return 'bg-blue-500';
  if (sentiment >= 0.2) return 'bg-yellow-500';
  return 'bg-red-500';
}
