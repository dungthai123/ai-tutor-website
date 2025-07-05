'use client';

import React from 'react';
import { cn } from '@/utils/helpers';

export type FilterPeriod = 'today' | 'week' | 'month';

interface NotesFilterProps {
  activePeriod: FilterPeriod;
  onPeriodChange: (period: FilterPeriod) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  className?: string;
}

export function NotesFilter({ 
  activePeriod, 
  onPeriodChange, 
  currentMonth, 
  onMonthChange, 
  className 
}: NotesFilterProps) {
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
    <div className={cn('flex items-center justify-between', className)}>
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
  );
} 