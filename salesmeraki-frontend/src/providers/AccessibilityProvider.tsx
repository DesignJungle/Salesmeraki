'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Announcer from '@/components/accessibility/Announcer';

interface AccessibilityContextType {
  announce: (message: string, assertive?: boolean) => void;
  messages: {
    polite: string[];
    assertive: string[];
  };
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [politeMessages, setPoliteMessages] = useState<string[]>([]);
  const [assertiveMessages, setAssertiveMessages] = useState<string[]>([]);
  
  const announce = useCallback((message: string, assertive = false) => {
    if (assertive) {
      setAssertiveMessages((prev) => [...prev, message]);
    } else {
      setPoliteMessages((prev) => [...prev, message]);
    }
  }, []);
  
  const value = {
    announce,
    messages: {
      polite: politeMessages,
      assertive: assertiveMessages,
    },
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <Announcer messages={politeMessages} assertive={false} />
      <Announcer messages={assertiveMessages} assertive={true} />
    </AccessibilityContext.Provider>
  );
}
