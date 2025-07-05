'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '../types';
import { useNotes } from './useNotes';
import { FilterPeriod } from '../components';

export function useNotesPage() {
  const router = useRouter();
  const { notes, loading, error, createNote } = useNotes();
  const [activePeriod, setActivePeriod] = useState<FilterPeriod>('today');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter notes based on the active period
  const filteredNotes = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return notes.filter((note) => {
      const noteDate = new Date(note.createdAt);
      const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());
      
      switch (activePeriod) {
        case 'today':
          return noteDateOnly.getTime() === today.getTime();
          
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
          return noteDateOnly >= weekStart && noteDateOnly <= weekEnd;
          
        case 'month':
          return noteDate.getMonth() === currentMonth.getMonth() && 
                 noteDate.getFullYear() === currentMonth.getFullYear();
          
        default:
          return true;
      }
    });
  }, [notes, activePeriod, currentMonth]);

  // Sort notes by creation date (newest first)
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [filteredNotes]);

  // Handle creating a new note
  const handleNewNote = () => {
    try {
      const newNote = createNote('', 'New Note');
      
      // Navigate to the new note's edit page if creation was successful
      if (newNote) {
        router.push(`/notes/${newNote.id}`);
      }
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  };

  // Handle clicking on an existing note
  const handleNoteClick = (note: Note) => {
    router.push(`/notes/${note.id}`);
  };

  // Handle period change
  const handlePeriodChange = (period: FilterPeriod) => {
    setActivePeriod(period);
    
    // If switching to month view, set current month to now
    if (period === 'month') {
      setCurrentMonth(new Date());
    }
  };

  // Handle month navigation
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    // Automatically switch to month view when navigating months
    if (activePeriod !== 'month') {
      setActivePeriod('month');
    }
  };

  // Get counts for each period
  const getCounts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todayCount = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());
      return noteDateOnly.getTime() === today.getTime();
    }).length;

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekCount = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      const noteDateOnly = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate());
      return noteDateOnly >= weekStart && noteDateOnly <= weekEnd;
    }).length;

    const monthCount = notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.getMonth() === currentMonth.getMonth() && 
             noteDate.getFullYear() === currentMonth.getFullYear();
    }).length;

    return { todayCount, weekCount, monthCount };
  };

  return {
    // Data
    notes: sortedNotes,
    loading,
    error,
    
    // Filter state
    activePeriod,
    currentMonth,
    
    // Handlers
    handleNewNote,
    handleNoteClick,
    handlePeriodChange,
    handleMonthChange,
    
    // Utilities
    getCounts
  };
} 