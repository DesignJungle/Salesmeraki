'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Feedback {
  id: string;
  category: 'positive' | 'improvement' | 'suggestion';
  content: string;
}

interface Analysis {
  strengths: string[];
  improvements: string[];
  score: {
    overall: number;
    categories: {
      clarity: number;
      persuasion: number;
      engagement: number;
      objectionHandling: number;
    };
  };
}

export function AICoaching() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to AI Sales Coach! I can help you practice your sales pitch, analyze your approach, and provide feedback to improve your sales skills. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'analysis'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock scenarios
  const scenarios = [
    'Enterprise SaaS Demo',
    'Cold Call to C-Level Executive',
    'Product Demo for SMB',
    'Handling Price Objections',
    'Closing Techniques Practice'
  ];

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In a real app, this would call an API
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateResponse(input),
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  // Mock response generation
  const generateResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();

    if (userInputLower.includes('help') || userInputLower.includes('what can you do')) {
      return "I can help you practice your sales pitch, role-play customer scenarios, provide feedback on your approach, and analyze your sales techniques. Just tell me what you'd like to practice!";
    }

    if (userInputLower.includes('scenario') || userInputLower.includes('practice')) {
      return "Great! Let's practice a sales scenario. I can role-play as a potential customer, and you can practice your pitch. What type of scenario would you like to practice? For example: cold call, product demo, handling objections, or closing a deal?";
    }

    if (userInputLower.includes('cold call')) {
      setScenario('Cold Call to C-Level Executive');
      return "Let's practice a cold call scenario. I'll play the role of a busy CFO at a mid-sized company. You're calling to introduce your sales analytics software. Go ahead with your introduction!";
    }

    if (userInputLower.includes('demo') || userInputLower.includes('presentation')) {
      setScenario('Product Demo for SMB');
      return "Let's practice a product demo. I'll be the operations manager at a small business looking for a solution to streamline our sales process. Show me how your product can help my team!";
    }

    if (userInputLower.includes('objection') || userInputLower.includes('expensive') || userInputLower.includes('price')) {
      setScenario('Handling Price Objections');
      return "I understand you want to practice handling price objections. I'll play a prospect who thinks your solution is too expensive. 'Your product looks interesting, but honestly, the price point is much higher than what we've budgeted for. We're also looking at a competitor that's offering something similar for less.'";
    }

    if (userInputLower.includes('closing') || userInputLower.includes('close the deal')) {
      setScenario('Closing Techniques Practice');
      return "Let's practice closing techniques. I'll be a prospect who's interested but hesitant to commit. 'I like what I'm seeing, but I need to discuss this with my team before making a decision. Can we reconnect next quarter?'";
    }

    if (userInputLower.includes('analyze') || userInputLower.includes('feedback') || userInputLower.includes('how did i do')) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveTab('analysis');
        generateAnalysis();
      }, 2000);
      return "I'll analyze your sales approach based on our conversation. Give me a moment...";
    }

    // Default responses for ongoing conversation
    const defaultResponses = [
      "That's a good approach. How would you handle if the customer asks about implementation time?",
      "Interesting point about the ROI. Can you elaborate on how you'd quantify that for different customer segments?",
      "I see your strategy. What if I told you our budget is already allocated for this year?",
      "Good explanation of the features. How do these compare to your competitors?",
      "I'm concerned about the learning curve for my team. How do you address training needs?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Generate mock analysis
  const generateAnalysis = () => {
    const mockAnalysis: Analysis = {
      strengths: [
        'Clear explanation of product benefits',
        'Good use of open-ended questions',
        'Effective handling of initial objections',
        'Personalized approach to customer needs'
      ],
      improvements: [
        'Could provide more specific examples',
        'Consider addressing ROI more explicitly',
        'More emphasis on differentiation from competitors'
      ],
      score: {
        overall: 82,
        categories: {
          clarity: 85,
          persuasion: 78,
          engagement: 88,
          objectionHandling: 76
        }
      }
    };

    setAnalysis(mockAnalysis);

    const mockFeedback: Feedback[] = [
      {
        id: '1',
        category: 'positive',
        content: 'Your approach to understanding customer needs before pitching solutions is excellent.'
      },
      {
        id: '2',
        category: 'improvement',
        content: 'Try to be more specific with your value proposition - quantify the benefits when possible.'
      },
      {
        id: '3',
        category: 'suggestion',
        content: 'Consider using the "feel, felt, found" technique when addressing objections about price.'
      },
      {
        id: '4',
        category: 'positive',
        content: 'Good job maintaining a conversational tone throughout the interaction.'
      }
    ];

    setFeedback(mockFeedback);
  };

  // Toggle voice recording (mock)
  const toggleRecording = () => {
    setIsRecording(!isRecording);

    if (!isRecording) {
      // In a real app, this would start recording
      setTimeout(() => {
        setIsRecording(false);
        setInput("I think your product could help us streamline our sales process, but I am concerned about the implementation time and training our team.");
      }, 3000);
    }
  };

  // Start a new practice session
  const startNewSession = () => {
    setMessages([
      {
        id: '1',
        role: 'system',
        content: 'Welcome to AI Sales Coach! I can help you practice your sales pitch, analyze your approach, and provide feedback to improve your sales skills. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    setFeedback([]);
    setAnalysis(null);
    setActiveTab('chat');
    setScenario(null);
  };

  // Select a scenario
  const selectScenario = (scenarioName: string) => {
    setScenario(scenarioName);

    let scenarioPrompt = '';
    switch (scenarioName) {
      case 'Enterprise SaaS Demo':
        scenarioPrompt = "I'll play the role of a CTO at an enterprise company looking for a SaaS solution to improve our sales analytics. Show me how your product can help us scale our operations.";
        break;
      case 'Cold Call to C-Level Executive':
        scenarioPrompt = "I'll play the role of a busy CFO who just picked up your cold call. You have about 30 seconds to capture my interest before I need to go to my next meeting.";
        break;
      case 'Product Demo for SMB':
        scenarioPrompt = "I'm the owner of a growing small business with 25 employees. I'm interested in your CRM solution but concerned about ease of use. Walk me through how it works.";
        break;
      case 'Handling Price Objections':
        scenarioPrompt = "Your solution looks good, but frankly, it's about 30% above our budget. Why should we choose you over the less expensive alternatives we're considering?";
        break;
      case 'Closing Techniques Practice':
        scenarioPrompt = "I like what I'm seeing, but I need to think about it and discuss with my team. Maybe we can reconnect in a few months?";
        break;
      default:
        scenarioPrompt = "Let's practice a sales scenario. What's your approach?";
    }

    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `Let's practice the "${scenarioName}" scenario. ${scenarioPrompt}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, systemMessage]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <LightBulbIcon className="h-6 w-6 mr-2" />
            AI Sales Coach
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
              Practice
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1 rounded-md text-sm ${
                activeTab === 'analysis'
                  ? 'bg-white text-primary'
                  : 'bg-primary-dark text-white'
              }`}
              disabled={!analysis}
            >
              <ChartBarIcon className="h-5 w-5 inline mr-1" />
              Analysis
            </button>
          </div>
        </div>

        {scenario && (
          <div className="mt-2 text-sm bg-primary-dark rounded-md p-2">
            <span className="font-medium">Current Scenario:</span> {scenario}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : message.role === 'system'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-indigo-100 text-indigo-800 rounded-lg p-3">
                    <div className="flex items-center">
                      <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                      <span>Analyzing your sales approach...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex items-center">
                <button
                  onClick={toggleRecording}
                  className={`p-2 rounded-full mr-2 ${
                    isRecording
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-full ml-2 ${
                    !input.trim() || isLoading
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Scenario Selection */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Practice Scenarios:</p>
                <div className="flex flex-wrap gap-2">
                  {scenarios.map((s) => (
                    <button
                      key={s}
                      onClick={() => selectScenario(s)}
                      className={`text-xs px-2 py-1 rounded-md ${
                        scenario === s
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            {analysis ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-block rounded-full bg-gray-100 p-3 mb-2">
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary">{analysis.score.overall}</span>
                      </div>
                      <svg className="w-24 h-24" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="3"
                          strokeDasharray={`${analysis.score.overall}, 100`}
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">Overall Performance</h3>
                  <p className="text-gray-500">Based on your sales conversation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <ArrowPathIcon className="h-5 w-5 text-amber-500 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-amber-500 mr-2">→</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Category Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analysis.score.categories).map(([category, score]) => (
                      <div key={category} className="bg-white p-3 rounded-lg border">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm capitalize">{category}</span>
                          <span className="text-sm font-semibold">{score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Detailed Feedback</h3>
                  <div className="space-y-3">
                    {feedback.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-lg ${
                          item.category === 'positive'
                            ? 'bg-green-50 border-l-4 border-green-400'
                            : item.category === 'improvement'
                            ? 'bg-amber-50 border-l-4 border-amber-400'
                            : 'bg-blue-50 border-l-4 border-blue-400'
                        }`}
                      >
                        <div className="flex items-start">
                          {item.category === 'positive' ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          ) : item.category === 'improvement' ? (
                            <ArrowPathIcon className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                          ) : (
                            <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          )}
                          <p className="text-sm">{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={startNewSession}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Start New Practice Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <DocumentTextIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No Analysis Available</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  Complete a practice session and ask for feedback to see your performance analysis.
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Go to Practice
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
