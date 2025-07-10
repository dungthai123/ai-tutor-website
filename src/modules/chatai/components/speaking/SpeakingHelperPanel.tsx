'use client';

import React from 'react';
import { SpeakingHelperForm } from './SpeakingHelperForm';
import { SpeakingHelperResults } from './SpeakingHelperResults';
import { ErrorMessage } from '@/modules/aitutor/components/ui/ErrorMessage';
import { useSpeakingHelper } from '../../hooks/speaking/useSpeakingHelper';
import type { TopicDetail } from '../../types';

interface SpeakingHelperPanelProps {
  topicDetail?: TopicDetail | null;
}

export function SpeakingHelperPanel({ topicDetail }: SpeakingHelperPanelProps) {
  const {
    result,
    loading,
    error,
    generateSpeakingHelp,
    reset,
    clearError,
  } = useSpeakingHelper();

  // Extract current topic from topicDetail
  const currentTopic = topicDetail?.title || '';

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <ErrorMessage 
          error={error}
          onRetry={clearError}
        />
      )}

      {/* Speaking Helper Form or Results */}
      {result ? (
        <SpeakingHelperResults 
          result={result}
          onReset={reset}
        />
      ) : (
        <SpeakingHelperForm
          onSubmit={generateSpeakingHelp}
          loading={loading}
          currentTopic={currentTopic}
        />
      )}
    </div>
  );
} 