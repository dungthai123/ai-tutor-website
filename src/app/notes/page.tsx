'use client';

import React from 'react';
import { NotesFilter, NotesGrid } from '@/modules/notes/components';
import { useNotesPage } from '@/modules/notes/hooks';
import { MainLayout } from '@/shared/components/layout/MainLayout';

export default function NotesPage() {
  const {
    notes,
    loading,
    error,
    activePeriod,
    currentMonth,
    handleNewNote,
    handleNoteClick,
    handlePeriodChange,
    handleMonthChange
  } = useNotesPage();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📔 My Notes
          </h1>
          <p className="text-gray-600">
            Organize your thoughts and save important information
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8">
          <NotesFilter
            activePeriod={activePeriod}
            onPeriodChange={handlePeriodChange}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Notes Grid */}
        <NotesGrid
          notes={notes}
          onNoteClick={handleNoteClick}
          onNewNoteClick={handleNewNote}
          loading={loading}
        />

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Notes are saved locally in your browser. 
            Use the proofreading tool to automatically save corrected text as notes.
          </p>
        </div>
      </div>
    </div>
    </MainLayout>
  );
} 