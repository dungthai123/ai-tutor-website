import { type RefObject, useEffect, useCallback } from 'react';

export function useAutoScroll(scrollContentContainerRef: RefObject<Element | null>) {
  const scrollToBottom = useCallback(() => {
    if (scrollContentContainerRef.current) {
      const element = scrollContentContainerRef.current;
      // Scroll to the very bottom - the padding will ensure messages are visible
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [scrollContentContainerRef]);

  useEffect(() => {
    const element = scrollContentContainerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    const mutationObserver = new MutationObserver(() => {
      // Scroll when content changes
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });

    resizeObserver.observe(element);
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Initial scroll
    requestAnimationFrame(() => {
      scrollToBottom();
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [scrollContentContainerRef, scrollToBottom]);

  // Return the scroll function so components can manually trigger it
  return scrollToBottom;
} 