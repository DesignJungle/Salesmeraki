import React, { useState, useEffect, useRef } from 'react';
import { wsService } from '@/utils/websocket';
import { useAuth } from '@/hooks/useAuth';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  attachments?: { url: string; type: string; name: string }[];
  threadId?: string;
  reactions?: { emoji: string; users: string[] }[];
  isThreadReply?: boolean;
}

export function TeamChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<{[key: string]: boolean}>({});
  const [threads, setThreads] = useState<{ [key: string]: ChatMessage[] }>({});
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    wsService.subscribe('chat_message', handleNewMessage);
    wsService.subscribe('typing_status', handleTypingStatus);

    return () => {
      wsService.unsubscribe('chat_message', handleNewMessage);
      wsService.unsubscribe('typing_status', handleTypingStatus);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleTypingStatus = (data: { userId: string; isTyping: boolean }) => {
    setIsTyping(prev => ({ ...prev, [data.userId]: data.isTyping }));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    wsService.send('chat_message', message);
    setNewMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    wsService.send('typing_status', { isTyping: e.target.value.length > 0 });
  };

  const addReaction = (messageId: string, emoji: string) => {
    wsService.send('chat_reaction', {
      messageId,
      emoji,
      userId: user.id,
    });
  };

  const sendThreadReply = (threadId: string, content: string) => {
    const message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      content,
      timestamp: new Date().toISOString(),
      threadId,
      isThreadReply: true,
    };

    wsService.send('chat_message', message);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Team Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className="flex flex-col">
            <div className={`flex ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-lg p-3 ${
                message.userId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{message.userName}</span>
                  <span className="text-xs opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{message.content}</p>
                {message.attachments?.map(attachment => (
                  <div key={attachment.url} className="mt-2">
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))}
                
                {/* Add reactions */}
                <div className="flex space-x-1 mt-2">
                  {message.reactions?.map(reaction => (
                    <button
                      key={reaction.emoji}
                      onClick={() => addReaction(message.id, reaction.emoji)}
                      className="px-2 py-1 rounded bg-opacity-20 hover:bg-opacity-30"
                    >
                      {reaction.emoji} {reaction.users.length}
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveThread(message.id)}
                    className="text-sm opacity-75 hover:opacity-100"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
            
            {/* Thread replies */}
            {threads[message.id] && (
              <div className="ml-8 mt-2 space-y-2">
                {threads[message.id].map(reply => (
                  <div key={reply.id} className="flex">
                    {/* Render thread replies similar to main messages */}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        {Object.entries(isTyping).map(([userId, typing]) => 
          typing && userId !== user.id && (
            <div key={userId} className="text-sm text-gray-500 italic mb-2">
              Someone is typing...
            </div>
          )
        )}
        <form onSubmit={sendMessage} className="flex space-x-2">
          <textarea
            value={newMessage}
            onChange={handleTyping}
            className="flex-1 resize-none border rounded-lg p-2"
            placeholder="Type your message..."
            rows={1}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}