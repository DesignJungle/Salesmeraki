// Accessibility configuration and utilities

/**
 * Focus trap utility for modal dialogs
 * Keeps focus within a specified element when Tab key is pressed
 */
export function setupFocusTrap(containerElement: HTMLElement) {
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Focus the first element when the trap is set up
  firstElement?.focus();
  
  function handleTabKey(e: KeyboardEvent) {
    // If Shift + Tab is pressed and focus is on first element, move to last element
    if (e.key === 'Tab' && e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } 
    // If Tab is pressed and focus is on last element, move to first element
    else if (e.key === 'Tab' && !e.shiftKey) {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }
  
  // Add event listener
  containerElement.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    containerElement.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Announce messages to screen readers using ARIA live regions
 */
export function announceToScreenReader(message: string, priority: 'assertive' | 'polite' = 'polite') {
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
}

/**
 * Skip to content link handler
 */
export function setupSkipToContent() {
  const skipLink = document.getElementById('skip-to-content');
  
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
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
    });
  }
}

/**
 * Keyboard navigation for custom components
 */
export function setupKeyboardNavigation(element: HTMLElement, options: {
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onEscape?: () => void;
}) {
  function handleKeyDown(e: KeyboardEvent) {
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
    }
  }
  
  element.addEventListener('keydown', handleKeyDown);
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}
