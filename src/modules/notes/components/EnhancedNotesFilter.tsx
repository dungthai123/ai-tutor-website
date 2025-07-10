'use client';

import React from 'react';
import { cn } from '@/utils/helpers';
import { TagFilter } from './TagFilter';

export type FilterPeriod = 'today' | 'week' | 'month';

interface EnhancedNotesFilterProps {
  activePeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  className?: string;
}

export function EnhancedNotesFilter({ 
  activePeriod, 
  onPeriodChange, 
  currentMonth, 
  onMonthChange,
  selectedTags,
  onTagToggle,
  onClearFilters,
  className 
}: EnhancedNotesFilterProps) {
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onMonthChange(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onMonthChange(nextMonth);
  };

  const filterOptions: { key: FilterPeriod; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Date Filter */}
      <div className="flex items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => onPeriodChange(option.key)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                activePeriod === option.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:bg-opacity-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
            aria-label="Previous month"
          >
            <span className="text-lg">◀</span>
          </button>
          
          <div className="text-lg font-medium text-gray-800 min-w-[160px] text-center">
            {formatMonth(currentMonth)}
          </div>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-900"
            aria-label="Next month"
          >
            <span className="text-lg">▶</span>
          </button>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="bg-gray-50 rounded-lg p-4">
        <TagFilter
          selectedTags={selectedTags}
          onTagToggle={onTagToggle}
          onClearFilters={onClearFilters}
        />
      </div>
    </div>
  );
} 