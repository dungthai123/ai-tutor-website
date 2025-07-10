'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useNotes } from './useNotes';
import { FilterPeriod } from '../components/EnhancedNotesFilter';

export function useEnhancedNotesPage() {
  const router = useRouter();
  const { notes, loading, error } = useNotes();
  
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter notes by date and tags
  const filteredNotes = useMemo(() => {
    let filtered = notes;

    // Filter by date period
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    filtered = filtered.filter(note => {
      const noteDate = new Date(note.createdAt);
      
      switch (activePeriod) {
        case 'today':
          return noteDate >= today;
        
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return noteDate >= weekAgo;
        
        case 'month':
          const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
          const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
          return noteDate >= monthStart && noteDate <= monthEnd;
        
        default:
          return true;
      }
    });

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        selectedTags.some(tag => note.tags.includes(tag))
      );
    }

    return filtered;
  }, [notes, activePeriod, currentMonth, selectedTags]);

  const handleNewNote = useCallback(() => {
    router.push('/notes/new');
  }, [router]);

  const handleNoteClick = useCallback((noteId: string) => {
    router.push(`/notes/${noteId}`);
  }, [router]);

  const handlePeriodChange = useCallback((period: FilterPeriod) => {
    setActivePeriod(period);
  }, []);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedTags([]);
  }, []);

  return {
    notes: filteredNotes,
    loading,
    error,
    activePeriod,
    currentMonth,
    selectedTags,
    handleNewNote,
    handleNoteClick,
    handlePeriodChange,
    handleMonthChange,
    handleTagToggle,
    handleClearFilters,
  };
} 