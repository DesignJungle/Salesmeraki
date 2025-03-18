import React, { useState, useEffect } from 'react';
import { wsService } from '@/utils/websocket';
import { CollaborationEvent } from '@/types/team';

export function TeamActivity() {
  const [activities, setActivities] = useState<CollaborationEvent[]>([]);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    wsService.subscribe('team_activity', handleNewActivity);
    return () => wsService.unsubscribe('team_activity', handleNewActivity);
  }, []);

  const handleNewActivity = (activity: CollaborationEvent) => {
    setActivities(prev => [activity, ...prev]);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'DOCUMENT_EDIT': return '📝';
      case 'CHAT_MESSAGE': return '💬';
      case 'DEAL_UPDATE': return '💰';
      case 'TASK_COMPLETE': return '✅';
      default: return '📌';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team Activity</h3>
        <div className="flex space-x-2">
          {['Documents', 'Chat', 'Deals', 'Tasks'].map(filter => (
            <button
              key={filter}
              onClick={() => setFilters(prev => 
                prev.includes(filter) 
                  ? prev.filter(f => f !== filter)
                  : [...prev, filter]
              )}
              className={`px-3 py-1 rounded ${
                filters.includes(filter) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded">
            <span className="text-2xl">{getActivityIcon(activity.type)}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{activity.user}</span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-gray-600">{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}