'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlobalNotesState } from '@/modules/notes/types';

interface GlobalNotesStore extends GlobalNotesState {
  // Actions
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  setSelectedTags: (tags: string[]) => void;
  toggleTag: (tag: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useGlobalNotesStore = create<GlobalNotesStore>()(
  persist(
    (set) => ({
      // Initial state
      isOpen: false,
      selectedTags: [],
      searchQuery: '',

      // Actions
      togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
      
      openPanel: () => set({ isOpen: true }),
      
      closePanel: () => set({ isOpen: false }),
      
      setSelectedTags: (tags: string[]) => set({ selectedTags: tags }),
      
      toggleTag: (tag: string) => set((state) => ({
        selectedTags: state.selectedTags.includes(tag)
          ? state.selectedTags.filter(t => t !== tag)
          : [...state.selectedTags, tag]
      })),
      
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      
      clearFilters: () => set({ selectedTags: [], searchQuery: '' }),
    }),
    {
      name: 'global-notes-store',
      partialize: (state) => ({
        selectedTags: state.selectedTags,
        searchQuery: state.searchQuery,
        // Don't persist isOpen - always start closed
      }),
    }
  )
); 