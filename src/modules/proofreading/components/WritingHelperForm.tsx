'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/buttons/Button';
import { WritingHelperRequest } from '../types';

interface WritingHelperFormProps {
  onSubmit: (request: WritingHelperRequest) => void;
  loading: boolean;
}

const WRITING_STYLES = [
  'Diary',
  'Story',
  'Formal Journal',
  'Emotional Monologue',
  'Letter',
  'Essay',
  'Blog Post',
  'Creative Writing',
  'Academic Writing',
  'Personal Reflection'
];

const TONES = [
  'Positive',
  'Neutral',
  'Reflective',
  'Sad',
  'Confessional',
  'Romantic',
  'Angry',
  'Humorous',
  'Inspirational',
  'Nostalgic'
];

const LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

export function WritingHelperForm({ onSubmit, loading }: WritingHelperFormProps) {
  const [formData, setFormData] = useState<WritingHelperRequest>({
    topic: '',
    style: 'Diary',
    tone: 'Positive',
    level: 'Intermediate'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof WritingHelperRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🤖 AI Writing Helper
        </h2>
        <p className="text-gray-600">
          Get personalized writing guidance with outlines, vocabulary, and style tips.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
            📝 What do you want to write about?
          </label>
          <textarea
            id="topic"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            placeholder="e.g., A walk on the beach at sunset, My first day at school, A memorable family dinner..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            maxLength={500}
            required
          />
          <div className="mt-1 text-xs text-gray-500">
            {formData.topic.length}/500 characters
          </div>
        </div>

        {/* Form Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Writing Style */}
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
              ✍️ Writing Style
            </label>
            <select
              id="style"
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {WRITING_STYLES.map(style => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
              🎭 Tone
            </label>
            <select
              id="tone"
              value={formData.tone}
              onChange={(e) => handleInputChange('tone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {TONES.map(tone => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Level
            </label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {LEVELS.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !formData.topic.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <span>🚀</span>
                Generate Outline & Suggestions
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 