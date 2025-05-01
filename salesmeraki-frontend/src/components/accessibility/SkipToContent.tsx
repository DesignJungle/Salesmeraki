'use client';

import { useEffect, useRef } from 'react';

export default function SkipToContent() {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const skipLink = skipLinkRef.current;
    
    if (skipLink) {
      const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        
        // Find the main content area
        const mainContent = document.getElementById('main-content');
        
        if (mainContent) {
          // Set tabindex to make it focusable
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
          
          // Remove tabindex after blur
          mainContent.addEventListener('blur', () => {
            mainContent.removeAttribute('tabindex');
          }, { once: true });
        }
      };
      
      skipLink.addEventListener('click', handleClick as any);
      
      return () => {
        skipLink.removeEventListener('click', handleClick as any);
      };
    }
  }, []);
  
  return (
    <a
      ref={skipLinkRef}
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-primary focus:border-2 focus:border-primary"
    >
      Skip to content
    </a>
  );
}
