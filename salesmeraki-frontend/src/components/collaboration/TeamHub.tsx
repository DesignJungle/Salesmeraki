import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { TeamMember, CollaborationEvent } from '@/types/team';
import { TeamChat } from './TeamChat';
import { SharedDocuments } from './SharedDocuments';
import { PresenceStatus, wsService } from '@/utils/websocket';

export function TeamHub() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activities, setActivities] = useState<CollaborationEvent[]>([]);
  const [selectedView, setSelectedView] = useState<'chat' | 'documents' | 'activity'>('chat');
  const ws = useWebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/team-collaboration`);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'MEMBER_UPDATE':
          setTeamMembers(prev => 
            prev.map(member => 
              member.id === data.member.id ? { ...member, ...data.member } : member
            )
          );
          break;
        case 'NEW_ACTIVITY':
          setActivities(prev => [data.activity, ...prev]);
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [ws]);

  const updateUserStatus = (status: PresenceStatus, customMessage?: string) => {
    wsService.updatePresence(status, customMessage);
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-4rem)]">
      <div className="col-span-3">
        <div className="bg-white p-6 rounded-lg shadow h-full">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <div className="space-y-4">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  member.isOnline ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <span className="font-medium">{member.name}</span>
                  <p className="text-sm text-gray-500">{member.customStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-6 h-full">
        <div className="bg-white rounded-lg shadow h-full flex flex-col">
          <div className="border-b px-6 py-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedView('chat')}
                className={`px-4 py-2 rounded ${
                  selectedView === 'chat' ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setSelectedView('documents')}
                className={`px-4 py-2 rounded ${
                  selectedView === 'documents' ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setSelectedView('activity')}
                className={`px-4 py-2 rounded ${
                  selectedView === 'activity' ? 'bg-blue-500 text-white' : 'text-gray-600'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedView === 'chat' && <TeamChat />}
            {selectedView === 'documents' && <SharedDocuments />}
            {selectedView === 'activity' && (
              <div className="p-6 space-y-4 overflow-y-auto">
                {activities.map(activity => (
                  <div key={activity.id} className="border-b pb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="mt-2">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-3">
        <div className="bg-white p-6 rounded-lg shadow h-full">
          <h2 className="text-xl font-semibold mb-4">Your Status</h2>
          <div className="space-y-4">
            <button
              onClick={() => updateUserStatus(PresenceStatus.ONLINE)}
              className="w-full px-4 py-2 text-left rounded hover:bg-gray-100"
            >
              🟢 Online
            </button>
            <button
              onClick={() => updateUserStatus(PresenceStatus.BUSY)}
              className="w-full px-4 py-2 text-left rounded hover:bg-gray-100"
            >
              🔴 Busy
            </button>
            <button
              onClick={() => updateUserStatus(PresenceStatus.AWAY)}
              className="w-full px-4 py-2 text-left rounded hover:bg-gray-100"
            >
              🟡 Away
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}