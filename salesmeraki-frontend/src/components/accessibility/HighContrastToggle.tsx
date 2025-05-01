'use client';

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function HighContrastToggle() {
  const [highContrast, setHighContrast] = useState(false);
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('high-contrast-mode');
    const prefersDarkMode = window.matchMedia('(prefers-contrast: more)').matches;
    
    // Set high contrast if explicitly saved or if user prefers high contrast
    const shouldUseHighContrast = savedPreference === 'true' || prefersDarkMode;
    setHighContrast(shouldUseHighContrast);
    
    if (shouldUseHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }, []);
  
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    // Save preference to localStorage
    localStorage.setItem('high-contrast-mode', String(newValue));
    
    // Apply or remove the high-contrast class
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };
  
  return (
    <button
      onClick={toggleHighContrast}
      className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-pressed={highContrast}
      aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
    >
      {highContrast ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
