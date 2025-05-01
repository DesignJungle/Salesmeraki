'use client';

import { useEffect, useState } from 'react';

interface AnnouncerProps {
  messages: string[];
  assertive?: boolean;
}

/**
 * Component for announcing messages to screen readers
 * Uses ARIA live regions to announce messages
 * 
 * @param messages Array of messages to announce
 * @param assertive Whether to use assertive or polite announcements
 */
export default function Announcer({ messages, assertive = false }: AnnouncerProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  
  useEffect(() => {
    // Only announce the most recent message
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      setCurrentMessage(latestMessage);
      
      // Clear the message after a delay to prevent repeated announcements
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);
  
  return (
    <div
      className="sr-only"
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-relevant="additions"
    >
      {currentMessage}
    </div>
  );
}
