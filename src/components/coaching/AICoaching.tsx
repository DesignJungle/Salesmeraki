'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Feedback {
  id: string;
  type: 'strength' | 'improvement';
  content: string;
}

interface Analysis {
  score: number;
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
}

export function AICoaching() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In a real app, this would call an API
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: generateAIResponse(input),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    // This is a mock response generator
    // In a real app, this would be replaced with an API call to a language model
    
    if (userInput.toLowerCase().includes('help')) {
      return "I can help you practice sales scenarios, provide feedback on your approach, and offer suggestions for improvement. Would you like to practice a specific scenario?";
    }
    
    if (userInput.toLowerCase().includes('scenario') || userInput.toLowerCase().includes('practice')) {
      return "Great! Let's practice. Choose a scenario: Enterprise SaaS Demo, Cold Call to C-Level Executive, Product Demo for SMB, Handling Price Objections, or Closing Techniques Practice.";
    }
    
    if (userInput.toLowerCase().includes('objection') || userInput.toLowerCase().includes('price')) {
      return "When handling price objections, focus on value rather than cost. Try saying: 'I understand budget is a concern. Let's look at the ROI our solution provides...' Would you like to practice this approach?";
    }
    
    if (userInput.toLowerCase().includes('closing') || userInput.toLowerCase().includes('close')) {
      return "For effective closing, try the assumptive close technique: 'Based on our discussion, I think the Enterprise plan would be the best fit. Should we set up implementation for next week?' This assumes the sale and moves the conversation forward.";
    }
    
    if (userInput.toLowerCase().includes('feedback') || userInput.toLowerCase().includes('analysis')) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setAnalysis({
          score: 78,
          strengths: [
            'Clear explanation of product features',
            'Good rapport building',
            'Effective use of open-ended questions'
          ],
          improvements: [
            'Could address objections more directly',
            'Need more focus on customer-specific value',
            'Consider using more social proof examples'
          ],
          nextSteps: [
            'Practice handling the price objection scenario',
            'Work on transitioning to closing more smoothly',
            'Develop 2-3 industry-specific case studies to reference'
          ]
        });
        setIsAnalyzing(false);
        setActiveTab('analysis');
      }, 2000);
      
      return "I'll analyze your sales approach. Give me a moment...";
    }
    
    return "That's a good approach. Try to focus on the customer's specific needs and pain points. How would you handle it if they mentioned budget constraints?";
  };

  const handleVoiceInput = () => {
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
  const startScenario = (scenario: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      sender: 'ai',
      content: `Let's practice the "${scenario}" scenario. I'll play the role of the customer, and you can practice your sales approach. Let's begin:\n\nHi, I received your email about your sales platform. I'm interested but have some questions about how it would fit our specific needs.`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">AI Sales Coach</h2>
        <p className="text-sm text-gray-500">Practice your sales skills with AI-powered coaching</p>
      </div>
      
      <Tab.Group onChange={(index) => setActiveTab(index === 0 ? 'chat' : 'analysis')}>
        <Tab.List className="flex p-1 space-x-1 bg-gray-100">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium leading-5 text-gray-700',
                'focus:outline-none',
                selected
                  ? 'bg-white shadow'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              )
            }
          >
            <div className="flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
              Practice
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm font-medium leading-5 text-gray-700',
                'focus:outline-none',
                selected
                  ? 'bg-white shadow'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              )
            }
          >
            <div className="flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Analysis
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels className="flex-1 overflow-hidden">
          <Tab.Panel className="h-full flex flex-col">
            <div className="p-4 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                <button
                  onClick={() => startScenario('Enterprise SaaS Demo')}
                  className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                >
                  Enterprise SaaS Demo
                </button>
                <button
                  onClick={() => startScenario('Cold Call to C-Level Executive')}
                  className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                >
                  Cold Call to C-Level Executive
                </button>
                <button
                  onClick={() => startScenario('Product Demo for SMB')}
                  className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                >
                  Product Demo for SMB
                </button>
                <button
                  onClick={() => startScenario('Handling Price Objections')}
                  className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                >
                  Handling Price Objections
                </button>
                <button
                  onClick={() => startScenario('Closing Techniques Practice')}
                  className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-center"
                >
                  Closing Techniques Practice
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3/4 p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3/4 p-3 rounded-lg bg-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-full ${
                    isRecording ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'
                  } hover:bg-gray-200`}
                  title={isRecording ? 'Stop voice input' : 'Start voice input'}
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
                  disabled={!input.trim()}
                  className={`p-2 rounded-full ${
                    input.trim()
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <ArrowPathIcon className="h-8 w-8 text-primary animate-spin" />
                  <p className="mt-4 text-gray-600">Analyzing your sales approach...</p>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 text-blue-600 text-2xl font-bold">
                      {analysis.score}%
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Overall Performance</h3>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Strengths
                    </h3>
                    <ul className="mt-2 pl-8 list-disc text-green-700">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-medium text-red-800 flex items-center">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="mt-2 pl-8 list-disc text-red-700">
                      {analysis.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800">Recommended Next Steps</h3>
                    <ol className="mt-2 pl-8 list-decimal text-blue-700">
                      {analysis.nextSteps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No Analysis Available</p>
                  <p className="text-sm mt-2">Complete a practice session to see analysis</p>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
