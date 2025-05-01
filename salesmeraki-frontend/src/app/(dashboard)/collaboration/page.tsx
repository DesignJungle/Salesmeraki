'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TeamCollaboration } from '@/components/collaboration/TeamCollaboration';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  VideoCameraIcon, 
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function CollaborationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('team-chat');

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Team Collaboration</h1>
          <p className="text-gray-600 mt-1">
            Work together with your team to close more deals
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('team-chat')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team-chat'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-1" />
            Team Chat
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'meetings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <VideoCameraIcon className="h-5 w-5 inline mr-1" />
            Meetings
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CalendarIcon className="h-5 w-5 inline mr-1" />
            Team Calendar
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 inline mr-1" />
            Shared Documents
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'team-chat' && (
        <div className="h-[700px]">
          <TeamCollaboration />
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Team Meetings</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
              <VideoCameraIcon className="h-5 w-5 mr-2" />
              Schedule Meeting
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Weekly Sales Sync</h3>
                    <p className="text-gray-600">Recurring meeting every Monday</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">March 25, 2025 • 10:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">60 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">5 team members</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="text-primary hover:text-primary-dark text-sm">
                    View Details
                  </button>
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-sm">
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">TechCorp Deal Review</h3>
                    <p className="text-gray-600">One-time meeting</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Scheduled
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">March 27, 2025 • 2:00 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">45 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">3 team members</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="text-primary hover:text-primary-dark text-sm">
                    View Details
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Q2 Planning Session</h3>
                    <p className="text-gray-600">Quarterly planning</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Scheduled
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">March 31, 2025 • 9:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">120 minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">8 team members</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="text-primary hover:text-primary-dark text-sm">
                    View Details
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm">
                    Join Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Team Calendar</h2>
            <div className="flex space-x-2">
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                Day
              </button>
              <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm">
                Week
              </button>
              <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                Month
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-gray-700 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
              {Array.from({ length: 35 }).map((_, index) => {
                const day = index + 1;
                const isCurrentMonth = day <= 31;
                const isToday = day === 18;
                
                return (
                  <div
                    key={index}
                    className={`border-r border-b p-2 ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                        {isCurrentMonth ? day : day - 31}
                      </span>
                      
                      {/* Example events */}
                      {day === 18 && (
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    
                    {/* Example events */}
                    {day === 18 && (
                      <div className="mt-1 text-xs bg-green-100 text-green-800 p-1 rounded truncate">
                        10:00 AM - Weekly Sync
                      </div>
                    )}
                    {day === 20 && (
                      <div className="mt-1 text-xs bg-blue-100 text-blue-800 p-1 rounded truncate">
                        2:00 PM - Client Call
                      </div>
                    )}
                    {day === 25 && (
                      <div className="mt-1 text-xs bg-purple-100 text-purple-800 p-1 rounded truncate">
                        9:00 AM - Team Meeting
                      </div>
                    )}
                    {day === 27 && (
                      <div className="mt-1 text-xs bg-yellow-100 text-yellow-800 p-1 rounded truncate">
                        2:00 PM - Deal Review
                      </div>
                    )}
                    {day === 31 && (
                      <div className="mt-1 text-xs bg-red-100 text-red-800 p-1 rounded truncate">
                        9:00 AM - Q2 Planning
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Shared Documents</h2>
            <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Upload Document
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">TechCorp Proposal</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Proposal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Alex Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 18, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Review
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">GlobalTech Contract</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Contract
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    John Davis
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 15, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Approved
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      View
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">Q2 Sales Strategy</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Presentation
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    You
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 10, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">InnovateSoft Proposal</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Proposal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Maria Smith
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 19, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Sent
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
