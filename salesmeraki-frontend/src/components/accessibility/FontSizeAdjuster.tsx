'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from '@heroicons/react/24/outline';

export default function FontSizeAdjuster() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100); // 100% is default
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize) {
      const size = parseInt(savedFontSize, 10);
      setFontSize(size);
      applyFontSize(size);
    }
  }, []);
  
  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
    localStorage.setItem('font-size', size.toString());
  };
  
  const increaseFontSize = () => {
    if (fontSize < 150) { // Max 150%
      const newSize = fontSize + 10;
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };
  
  const decreaseFontSize = () => {
    if (fontSize > 80) { // Min 80%
      const newSize = fontSize - 10;
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };
  
  const resetFontSize = () => {
    setFontSize(100);
    applyFontSize(100);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-expanded={isOpen}
        aria-label="Adjust font size"
      >
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 z-10 border border-gray-200">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Font Size: {fontSize}%</span>
              <button
                onClick={resetFontSize}
                className="text-xs text-primary hover:text-primary-dark"
                aria-label="Reset to default font size"
              >
                Reset
              </button>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={decreaseFontSize}
                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                aria-label="Decrease font size"
                disabled={fontSize <= 80}
              >
                <MagnifyingGlassMinusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <div className="h-2 w-24 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: `${((fontSize - 80) / 70) * 100}%` }}
                ></div>
              </div>
              
              <button
                onClick={increaseFontSize}
                className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
                aria-label="Increase font size"
                disabled={fontSize >= 150}
              >
                <MagnifyingGlassPlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
