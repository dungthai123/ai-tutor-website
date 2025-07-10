'use client';

import React from 'react';
import { useGlobalNotesStore } from '@/shared/stores/globalNotesStore';
import { cn } from '@/utils/helpers';

export function FloatingAddNoteButton() {
  const { togglePanel } = useGlobalNotesStore();

  return (
    <button
      onClick={togglePanel}
      className={cn(
        // Layout
        'fixed bottom-6 right-24 z-50', // Adjusted to be to the left of the chat button
        'flex items-center justify-center',
        'w-14 h-14 rounded-full',
        // Colors & Effects
        'bg-green-600 hover:bg-green-700 active:bg-green-800',
        'text-white shadow-xl hover:shadow-2xl',
        'transition-all duration-200 ease-in-out',
        // Animation
        'transform hover:scale-105 active:scale-95',
        // Focus states
        'focus:outline-none focus:ring-4 focus:ring-green-300'
      )}
      aria-label="Add a new note"
      title="Add a new note"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </button>
  );
} 