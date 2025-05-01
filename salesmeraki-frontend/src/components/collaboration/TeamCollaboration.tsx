'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  UserGroupIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  PaperAirplaneIcon,
  PlusIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

interface SharedDocument {
  id: string;
  name: string;
  type: 'proposal' | 'contract' | 'presentation' | 'other';
  lastModified: Date;
  sharedBy: {
    id: string;
    name: string;
  };
  status: 'draft' | 'review' | 'approved' | 'sent';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: Date;
}

interface Task {
  id: string;
  title: string;
  assignedTo: {
    id: string;
    name: string;
  };
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

export function TeamCollaboration() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'documents' | 'tasks'>('chat');
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Load mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMessages(getMockMessages());
      setDocuments(getMockDocuments());
      setTeamMembers(getMockTeamMembers());
      setTasks(getMockTasks());
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      content: messageInput,
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
    
    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        userId: 'team-member-1',
        userName: 'Alex Johnson',
        userAvatar: '/avatars/alex.jpg',
        content: getRandomResponse(),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };
  
  const getRandomResponse = () => {
    const responses = [
      "Great point! I'll update the proposal with this information.",
      "I just spoke with the client and they're interested in moving forward. Let's schedule a follow-up call.",
      "Can you share the latest pricing sheet with me? I need to include it in my presentation tomorrow.",
      "The demo went well yesterday. The client had some questions about implementation timeline though.",
      "I've updated the sales forecast for Q2. We're on track to exceed our targets!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <UserGroupIcon className="h-6 w-6 mr-2" />
            Team Collaboration
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'chat' 
                  ? 'bg-white text-primary' 
                  : 'bg-primary-dark text-white'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 inline mr-1" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'documents' 
                  ? 'bg-white text-primary' 
                  : 'bg-primary-dark text-white'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-1" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'tasks' 
                  ? 'bg-white text-primary' 
                  : 'bg-primary-dark text-white'
              }`}
            >
              <CheckCircleIcon className="h-5 w-5 inline mr-1" />
              Tasks
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Team Members Sidebar */}
          <div className="w-64 border-r bg-gray-50 overflow-y-auto hidden md:block">
            <div className="p-4 border-b">
              <h3 className="font-medium text-gray-900">Team Members</h3>
            </div>
            <div className="p-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center p-2 hover:bg-gray-100 rounded-md">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="h-10 w-10 rounded-full" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${getStatusColor(member.status)}`}></span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.userId === 'current-user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.userId !== 'current-user' && (
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2 flex-shrink-0">
                          {message.userAvatar ? (
                            <img src={message.userAvatar} alt={message.userName} className="h-8 w-8 rounded-full" />
                          ) : (
                            message.userName.charAt(0)
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.userId === 'current-user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.userId !== 'current-user' && (
                          <p className="text-xs font-medium mb-1">{message.userName}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center text-xs bg-white bg-opacity-20 rounded p-1">
                                <DocumentTextIcon className="h-4 w-4 mr-1" />
                                <span>{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs mt-1 opacity-70">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex items-center">
                    <button
                      className="p-2 rounded-full mr-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title="Attach file"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className={`p-2 rounded-full ml-2 ${
                        !messageInput.trim()
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Shared Documents</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <PlusIcon className="h-5 w-5 mr-1" />
                    New Document
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 border-b bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Shared by {doc.sharedBy.name} • {formatDate(doc.lastModified)}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <DocumentTextIcon className="h-5 w-5 mr-1" />
                          <span>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</span>
                        </div>
                        <button className="text-primary hover:text-primary-dark text-sm flex items-center">
                          <ShareIcon className="h-4 w-4 mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Team Tasks</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-sm flex items-center">
                    <PlusIcon className="h-5 w-5 mr-1" />
                    New Task
                  </button>
                </div>
                
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="mr-3">
                            {task.status === 'completed' ? (
                              <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            ) : task.status === 'overdue' ? (
                              <XCircleIcon className="h-6 w-6 text-red-500" />
                            ) : (
                              <ClockIcon className="h-6 w-6 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Assigned to {task.assignedTo.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>Due {formatDate(task.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status === 'in_progress' 
                            ? 'In Progress' 
                            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                        <button className="text-primary hover:text-primary-dark text-sm">
                          Update Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock data functions
function getMockMessages(): Message[] {
  return [
    {
      id: '1',
      userId: 'team-member-1',
      userName: 'Alex Johnson',
      userAvatar: '/avatars/alex.jpg',
      content: 'Hey team, I just finished the client presentation for tomorrow. Can someone review it?',
      timestamp: new Date(Date.now() - 3600000 * 5)
    },
    {
      id: '2',
      userId: 'team-member-2',
      userName: 'Maria Smith',
      content: 'I can take a look at it. Did you include the new pricing structure?',
      timestamp: new Date(Date.now() - 3600000 * 4.5)
    },
    {
      id: '3',
      userId: 'team-member-1',
      userName: 'Alex Johnson',
      userAvatar: '/avatars/alex.jpg',
      content: 'Yes, it\'s on slide 12. I also added the ROI calculator as requested.',
      timestamp: new Date(Date.now() - 3600000 * 4),
      attachments: [
        {
          id: 'att1',
          name: 'Client_Presentation_v2.pptx',
          type: 'presentation',
          url: '/documents/presentation.pptx'
        }
      ]
    },
    {
      id: '4',
      userId: 'team-member-3',
      userName: 'John Davis',
      content: 'The demo with TechCorp went well today. They had some questions about implementation timeline.',
      timestamp: new Date(Date.now() - 3600000 * 3)
    },
    {
      id: '5',
      userId: 'current-user',
      userName: 'You',
      content: 'Great to hear! What was their main concern about the timeline?',
      timestamp: new Date(Date.now() - 3600000 * 2.5)
    },
    {
      id: '6',
      userId: 'team-member-3',
      userName: 'John Davis',
      content: 'They need to go live before the end of Q2. I told them we could accommodate that with our expedited onboarding process.',
      timestamp: new Date(Date.now() - 3600000 * 2)
    },
    {
      id: '7',
      userId: 'team-member-1',
      userName: 'Alex Johnson',
      userAvatar: '/avatars/alex.jpg',
      content: 'I\'ve updated the sales forecast for Q2. We\'re on track to exceed our targets!',
      timestamp: new Date(Date.now() - 3600000)
    }
  ];
}

function getMockDocuments(): SharedDocument[] {
  return [
    {
      id: 'doc1',
      name: 'TechCorp Proposal',
      type: 'proposal',
      lastModified: new Date(Date.now() - 86400000 * 2),
      sharedBy: {
        id: 'team-member-1',
        name: 'Alex Johnson'
      },
      status: 'review'
    },
    {
      id: 'doc2',
      name: 'GlobalTech Contract',
      type: 'contract',
      lastModified: new Date(Date.now() - 86400000 * 5),
      sharedBy: {
        id: 'team-member-3',
        name: 'John Davis'
      },
      status: 'approved'
    },
    {
      id: 'doc3',
      name: 'Q2 Sales Strategy',
      type: 'presentation',
      lastModified: new Date(Date.now() - 86400000 * 10),
      sharedBy: {
        id: 'current-user',
        name: 'You'
      },
      status: 'draft'
    },
    {
      id: 'doc4',
      name: 'InnovateSoft Proposal',
      type: 'proposal',
      lastModified: new Date(Date.now() - 86400000),
      sharedBy: {
        id: 'team-member-2',
        name: 'Maria Smith'
      },
      status: 'sent'
    },
    {
      id: 'doc5',
      name: 'Competitive Analysis',
      type: 'other',
      lastModified: new Date(Date.now() - 86400000 * 7),
      sharedBy: {
        id: 'team-member-1',
        name: 'Alex Johnson'
      },
      status: 'review'
    },
    {
      id: 'doc6',
      name: 'Product Roadmap',
      type: 'presentation',
      lastModified: new Date(Date.now() - 86400000 * 14),
      sharedBy: {
        id: 'team-member-3',
        name: 'John Davis'
      },
      status: 'approved'
    }
  ];
}

function getMockTeamMembers(): TeamMember[] {
  return [
    {
      id: 'team-member-1',
      name: 'Alex Johnson',
      role: 'Senior Sales Rep',
      status: 'online'
    },
    {
      id: 'team-member-2',
      name: 'Maria Smith',
      role: 'Sales Rep',
      status: 'away',
      lastActive: new Date(Date.now() - 1800000)
    },
    {
      id: 'team-member-3',
      name: 'John Davis',
      role: 'Sales Rep',
      status: 'online'
    },
    {
      id: 'team-member-4',
      name: 'Sarah Wilson',
      role: 'Sales Manager',
      status: 'offline',
      lastActive: new Date(Date.now() - 86400000)
    },
    {
      id: 'current-user',
      name: 'You',
      role: 'Sales Rep',
      status: 'online'
    }
  ];
}

function getMockTasks(): Task[] {
  return [
    {
      id: 'task1',
      title: 'Follow up with TechCorp',
      assignedTo: {
        id: 'current-user',
        name: 'You'
      },
      dueDate: new Date(Date.now() + 86400000 * 2),
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'task2',
      title: 'Prepare quarterly review presentation',
      assignedTo: {
        id: 'team-member-1',
        name: 'Alex Johnson'
      },
      dueDate: new Date(Date.now() + 86400000 * 5),
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: 'task3',
      title: 'Send proposal to InnovateSoft',
      assignedTo: {
        id: 'team-member-2',
        name: 'Maria Smith'
      },
      dueDate: new Date(Date.now() - 86400000),
      status: 'completed',
      priority: 'high'
    },
    {
      id: 'task4',
      title: 'Update sales forecast',
      assignedTo: {
        id: 'team-member-3',
        name: 'John Davis'
      },
      dueDate: new Date(Date.now() - 86400000 * 2),
      status: 'overdue',
      priority: 'medium'
    },
    {
      id: 'task5',
      title: 'Schedule demo with NextGen Solutions',
      assignedTo: {
        id: 'current-user',
        name: 'You'
      },
      dueDate: new Date(Date.now() + 86400000 * 3),
      status: 'pending',
      priority: 'low'
    }
  ];
}
