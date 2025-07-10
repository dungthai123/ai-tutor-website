'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/buttons/Button';
import { SpeakingHelperRequest } from '../../types';

interface SpeakingHelperFormProps {
  onSubmit: (request: SpeakingHelperRequest) => void;
  loading: boolean;
  currentTopic?: string;
}

const LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced'
];

const TONES = [
  'Casual',
  'Formal',
  'Friendly',
  'Professional'
];

const FOCUS_AREAS = [
  'Grammar',
  'Vocabulary',
  'Pronunciation',
  'Conversation Flow'
];

export function SpeakingHelperForm({ onSubmit, loading, currentTopic }: SpeakingHelperFormProps) {
  const [formData, setFormData] = useState<SpeakingHelperRequest>({
    topic: currentTopic || '',
    level: 'Intermediate',
    tone: 'Friendly',
    focus: 'Conversation Flow'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.topic.trim()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof SpeakingHelperRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update topic when currentTopic changes
  React.useEffect(() => {
    if (currentTopic && currentTopic !== formData.topic) {
      setFormData(prev => ({
        ...prev,
        topic: currentTopic
      }));
    }
  }, [currentTopic, formData.topic]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
          🗣️ AI Speaking Helper
        </h3>
        <p className="text-sm text-gray-600">
          Get conversation suggestions and speaking tips
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Topic Input */}
        <div>
          <label htmlFor="speaking-topic" className="block text-xs font-medium text-gray-700 mb-1">
            💬 Conversation Topic
          </label>
          <textarea
            id="speaking-topic"
            value={formData.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            placeholder="What would you like to talk about? (e.g., ordering food, asking for directions, making friends...)"
            className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            maxLength={300}
            required
          />
          <div className="mt-1 text-xs text-gray-500">
            {formData.topic.length}/300 characters
          </div>
        </div>

        {/* Form Controls Grid */}
        <div className="grid grid-cols-1 gap-3">
          {/* Level */}
          <div>
            <label htmlFor="speaking-level" className="block text-xs font-medium text-gray-700 mb-1">
              🎯 Your Level
            </label>
            <select
              id="speaking-level"
              value={formData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              {LEVELS.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label htmlFor="speaking-tone" className="block text-xs font-medium text-gray-700 mb-1">
              🎭 Conversation Tone
            </label>
            <select
              id="speaking-tone"
              value={formData.tone}
              onChange={(e) => handleInputChange('tone', e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              {TONES.map(tone => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Focus Area */}
          <div>
            <label htmlFor="speaking-focus" className="block text-xs font-medium text-gray-700 mb-1">
              🎪 Focus Area
            </label>
            <select
              id="speaking-focus"
              value={formData.focus}
              onChange={(e) => handleInputChange('focus', e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              {FOCUS_AREAS.map(focus => (
                <option key={focus} value={focus}>
                  {focus}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading || !formData.topic.trim()}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <span>🚀</span>
                Get Speaking Tips
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 