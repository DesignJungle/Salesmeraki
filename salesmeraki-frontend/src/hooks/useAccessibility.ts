import { useEffect, useRef, useCallback } from 'react';
import { setupFocusTrap, setupKeyboardNavigation } from '@/lib/accessibility';

/**
 * Hook for managing focus trap in modal dialogs
 * @param isOpen Whether the modal is open
 * @returns Ref to attach to the modal container
 */
export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Save the previously focused element
      const previouslyFocused = document.activeElement as HTMLElement;
      
      // Set up the focus trap
      const cleanup = setupFocusTrap(containerRef.current);
      
      // Clean up function
      return () => {
        cleanup();
        // Restore focus to the previously focused element
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);
  
  return containerRef;
}

/**
 * Hook for keyboard navigation in custom components
 */
export function useKeyboardNavigation(options: {
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEscape?: () => void;
}) {
  const elementRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      return setupKeyboardNavigation(elementRef.current, options);
    }
  }, [options]);
  
  return elementRef;
}

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnouncer() {
  const announce = useCallback((message: string, priority: 'assertive' | 'polite' = 'polite') => {
    // Create or get the live region element
    let liveRegion = document.getElementById(`aria-live-${priority}`);
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = `aria-live-${priority}`;
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-relevant', 'additions');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only'; // Visually hidden but available to screen readers
      document.body.appendChild(liveRegion);
    }
    
    // Update the content to trigger announcement
    liveRegion.textContent = message;
    
    // Clear the announcement after a delay
    setTimeout(() => {
      liveRegion!.textContent = '';
    }, 3000);
  }, []);
  
  return { announce };
}

/**
 * Hook for managing focus within a list of items
 */
export function useFocusWithinList<T>(items: T[], initialFocusIndex = 0) {
  const [focusedIndex, setFocusedIndex] = useState(initialFocusIndex);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  
  // Reset refs array when items change
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items]);
  
  // Focus the item at the current index
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < items.length) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, items]);
  
  const focusNext = useCallback(() => {
    setFocusedIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items]);
  
  const focusPrevious = useCallback(() => {
    setFocusedIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items]);
  
  const focusFirst = useCallback(() => {
    setFocusedIndex(0);
  }, []);
  
  const focusLast = useCallback(() => {
    setFocusedIndex(items.length - 1);
  }, [items]);
  
  return {
    focusedIndex,
    setFocusedIndex,
    itemRefs,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast,
  };
}

// Missing import
import { useState } from 'react';
