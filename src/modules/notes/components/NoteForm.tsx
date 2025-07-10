'use client';

import React, { useState, useEffect } from 'react';
import { Note, NOTE_STYLES, TAG_LABELS, NoteTag, NOTE_TAGS } from '../types';
import { Button } from '@/shared/components/ui/buttons/Button';

interface NoteFormProps {
  note?: Note | null; // If provided, we're editing; otherwise creating
  onSave: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  // Populate form if editing
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags
      });
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    const noteData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      tags: formData.tags,
      style: NOTE_STYLES,
      source: 'manual' as const,
    };

    onSave(noteData);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const allTags = Object.values(NOTE_TAGS) as NoteTag[];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-md w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {note ? 'Edit Note' : 'Create New Note'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter note title..."
            maxLength={100}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write your note content..."
            rows={4}
            maxLength={1000}
            required
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.content.length}/1000 characters
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isSelected = formData.tags.includes(tag);
              const label = TAG_LABELS[tag];
              
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-3 py-1 text-xs rounded-full border transition-all duration-200
                    ${isSelected
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!formData.title.trim() || !formData.content.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {note ? 'Update Note' : 'Create Note'}
          </Button>
        </div>
      </form>
    </div>
  );
} 