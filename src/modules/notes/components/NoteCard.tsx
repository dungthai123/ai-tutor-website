'use client';

import React from 'react';
import Link from 'next/link';
import { Note } from '../types';
import { cn } from '@/utils/helpers';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  className?: string;
}

export function NoteCard({ note, onClick, className }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${displayHours}:${minutes} ${ampm}, ${dayName}`;
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Remove HTML tags for preview
  const getPlainTextContent = (htmlContent: string) => {
    return htmlContent.replace(/<[^>]*>/g, '').trim();
  };

  const plainContent = getPlainTextContent(note.content);

  return (
    <div 
      className={cn(
        'group relative rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200',
        'border border-opacity-50 cursor-pointer transform hover:scale-[1.02]',
        note.style.backgroundColor,
        note.style.textColor,
        note.style.borderColor,
        className
      )}
      onClick={onClick}
    >
      {/* Date */}
      <div className="text-sm opacity-75 mb-3">
        {formatDate(note.createdAt)}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-3 line-clamp-2">
        {note.title}
      </h3>

      {/* Content Preview */}
      <p className="text-sm opacity-80 mb-4 line-clamp-4 leading-relaxed">
        {truncateContent(plainContent)}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        {/* Timestamp */}
        <div className="text-xs opacity-60 flex items-center gap-1">
          <span>🕐</span>
          <span>{formatTime(note.createdAt)}</span>
        </div>

        {/* Edit Button */}
        <Link
          href={`/notes/${note.id}`}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'p-2 rounded-full hover:bg-black hover:bg-opacity-10',
            'flex items-center justify-center'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-lg">✏️</span>
        </Link>
      </div>

      {/* Source indicator */}
      {note.source === 'proofreader' && (
        <div className="absolute top-3 right-3 opacity-60">
          <span className="text-xs">📝</span>
        </div>
      )}
    </div>
  );
}

// New Note Card Component
interface NewNoteCardProps {
  onClick: () => void;
  className?: string;
}

export function NewNoteCard({ onClick, className }: NewNoteCardProps) {
  return (
    <div 
      className={cn(
        'group relative rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200',
        'border-2 border-dashed border-gray-300 hover:border-gray-400',
        'bg-white hover:bg-gray-50 cursor-pointer transform hover:scale-[1.02]',
        'flex flex-col items-center justify-center min-h-[280px]',
        className
      )}
      onClick={onClick}
    >
      {/* Plus Icon */}
      <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center mb-4">
        <span className="text-2xl text-gray-400 group-hover:text-gray-600">✏️</span>
      </div>

      {/* Text */}
      <h3 className="text-lg font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
        New Note
      </h3>
      <p className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors duration-200 mt-1">
        Create a new note
      </p>
    </div>
  );
} 