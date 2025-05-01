import { useCallback, useRef, useEffect } from 'react';
import { useAccessibilityContext } from '@/providers/AccessibilityProvider';

/**
 * Custom hook for accessibility features
 * Provides methods for announcing messages to screen readers,
 * managing focus, and handling keyboard navigation
 */
export function useA11y() {
  const { announce } = useAccessibilityContext();
  
  /**
   * Announce a message to screen readers
   * @param message Message to announce
   * @param assertive Whether to use assertive or polite announcements
   */
  const announceToScreenReader = useCallback((message: string, assertive = false) => {
    announce(message, assertive);
  }, [announce]);
  
  /**
   * Set up a focus trap within an element
   * @param isActive Whether the focus trap is active
   * @returns Ref to attach to the container element
   */
  const useFocusTrap = (isActive: boolean) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (!isActive || !containerRef.current) return;
      
      const container = containerRef.current;
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // Save the previously focused element
      const previouslyFocused = document.activeElement as HTMLElement;
      
      // Focus the first element
      firstElement.focus();
      
      const handleTabKey = (e: KeyboardEvent) => {
        // If Shift + Tab is pressed and focus is on first element, move to last element
        if (e.key === 'Tab' && e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } 
        // If Tab is pressed and focus is on last element, move to first element
        else if (e.key === 'Tab' && !e.shiftKey) {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
      
      // Add event listener
      container.addEventListener('keydown', handleTabKey);
      
      // Clean up
      return () => {
        container.removeEventListener('keydown', handleTabKey);
        // Restore focus to the previously focused element
        previouslyFocused?.focus();
      };
    }, [isActive]);
    
    return containerRef;
  };
  
  /**
   * Set up keyboard navigation for a component
   * @param options Keyboard event handlers
   * @returns Ref to attach to the element
   */
  const useKeyboardNavigation = (options: {
    onEnter?: () => void;
    onSpace?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
    onEscape?: () => void;
    onTab?: () => void;
  }) => {
    const elementRef = useRef<HTMLElement>(null);
    
    useEffect(() => {
      if (!elementRef.current) return;
      
      const element = elementRef.current;
      
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
            if (options.onEnter) {
              e.preventDefault();
              options.onEnter();
            }
            break;
          case ' ':
            if (options.onSpace) {
              e.preventDefault();
              options.onSpace();
            }
            break;
          case 'ArrowUp':
            if (options.onArrowUp) {
              e.preventDefault();
              options.onArrowUp();
            }
            break;
          case 'ArrowDown':
            if (options.onArrowDown) {
              e.preventDefault();
              options.onArrowDown();
            }
            break;
          case 'ArrowLeft':
            if (options.onArrowLeft) {
              e.preventDefault();
              options.onArrowLeft();
            }
            break;
          case 'ArrowRight':
            if (options.onArrowRight) {
              e.preventDefault();
              options.onArrowRight();
            }
            break;
          case 'Escape':
            if (options.onEscape) {
              e.preventDefault();
              options.onEscape();
            }
            break;
          case 'Tab':
            if (options.onTab) {
              // Don't prevent default for Tab to maintain normal navigation
              options.onTab();
            }
            break;
        }
      };
      
      element.addEventListener('keydown', handleKeyDown);
      
      return () => {
        element.removeEventListener('keydown', handleKeyDown);
      };
    }, [options]);
    
    return elementRef;
  };
  
  return {
    announceToScreenReader,
    useFocusTrap,
    useKeyboardNavigation,
  };
}
