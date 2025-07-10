'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TAG_LABELS, NoteTag } from '../types';
import { cn } from '@/utils/helpers';

interface TagFilterProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export function TagFilter({ selectedTags, onTagToggle, onClearFilters }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allTags = Object.keys(TAG_LABELS) as NoteTag[];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTagToggle = (tag: string) => {
    onTagToggle(tag);
    // Don't close dropdown to allow multiple selections
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filter by Tags</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center justify-between"
        >
          <span className="text-gray-700">
            {selectedTags.length === 0 
              ? 'Select tags...' 
              : `${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected`
            }
          </span>
          <svg 
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const label = TAG_LABELS[tag];
              
              return (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    'w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors flex items-center justify-between',
                    isSelected && 'bg-blue-50 text-blue-700'
                  )}
                >
                  <span>{label}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {TAG_LABELS[tag as NoteTag]}
              <button
                onClick={() => onTagToggle(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
} 