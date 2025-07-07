"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, CheckCircle } from 'lucide-react';
import { SpeechData } from '../../types';
import { cn } from '../../utils';

interface PronunciationDisplayProps {
  speechData: SpeechData;
  className?: string;
  compact?: boolean;
  showWordDetails?: boolean;
}

export const PronunciationDisplay: React.FC<PronunciationDisplayProps> = ({
  speechData,
  className,
  compact = false,
  showWordDetails = true,
}) => {
  if (!speechData.nBest || speechData.nBest.length === 0) {
    return (
      <div className={cn('rounded-lg bg-gray-50 p-4', className)}>
        <p className="text-sm text-gray-600">No pronunciation data available</p>
      </div>
    );
  }

  const nBest = speechData.nBest[0];
  const { accuracyScore, fluencyScore, completenessScore, pronScore } = nBest.pronunciationAssessment;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <Target className="h-4 w-4" />;
    return <Zap className="h-4 w-4" />;
  };

  const getFeedbackMessage = (score: number): string => {
    if (score >= 90) return 'Excellent pronunciation!';
    if (score >= 80) return 'Great job! Very clear pronunciation.';
    if (score >= 70) return 'Good pronunciation with room for improvement.';
    if (score >= 60) return 'Fair pronunciation. Keep practicing!';
    return 'Needs improvement. Focus on clarity.';
  };

  if (compact) {
    return (
      <div className={cn('rounded-lg bg-white border border-gray-200 p-3', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('p-1 rounded-full', getScoreBgColor(pronScore))}>
              {getScoreIcon(pronScore)}
            </div>
            <span className="text-sm font-medium text-gray-900">
              Pronunciation Score
            </span>
          </div>
          <div className={cn('text-lg font-bold', getScoreColor(pronScore))}>
            {Math.round(pronScore)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Overall Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-white border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-full', getScoreBgColor(pronScore))}>
              <Trophy className={cn('h-5 w-5', getScoreColor(pronScore))} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pronunciation Assessment</h3>
              <p className="text-sm text-gray-600">{getFeedbackMessage(pronScore)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-3xl font-bold', getScoreColor(pronScore))}>
              {Math.round(pronScore)}
            </div>
            <div className="text-xs text-gray-500">Overall Score</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={cn('text-xl font-bold', getScoreColor(accuracyScore))}>
              {Math.round(accuracyScore)}
            </div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="text-center">
            <div className={cn('text-xl font-bold', getScoreColor(fluencyScore))}>
              {Math.round(fluencyScore)}
            </div>
            <div className="text-xs text-gray-600">Fluency</div>
          </div>
          <div className="text-center">
            <div className={cn('text-xl font-bold', getScoreColor(completenessScore))}>
              {Math.round(completenessScore)}
            </div>
            <div className="text-xs text-gray-600">Completeness</div>
          </div>
        </div>
      </motion.div>

      {/* Word-by-Word Analysis */}
      {showWordDetails && nBest.words && nBest.words.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white border border-gray-200 p-4"
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Word-by-Word Analysis</h4>
          
          <div className="space-y-3">
            {nBest.words.map((wordData, index) => {
              const wordScore = wordData.pronunciationAssessment.accuracyScore;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('p-1 rounded-full', getScoreBgColor(wordScore))}>
                      {getScoreIcon(wordScore)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{wordData.word}</span>
                      <div className="text-xs text-gray-500">
                        Duration: {(wordData.duration / 10000000).toFixed(1)}s
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn('text-lg font-bold', getScoreColor(wordScore))}>
                      {Math.round(wordScore)}
                    </div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Syllable Details (if available) */}
      {showWordDetails && nBest.words && nBest.words.some(w => w.syllables && w.syllables.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg bg-white border border-gray-200 p-4"
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Syllable Breakdown</h4>
          
          <div className="space-y-4">
            {nBest.words.map((wordData, wordIndex) => {
              if (!wordData.syllables || wordData.syllables.length === 0) return null;
              
              return (
                <div key={wordIndex} className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">{wordData.word}</h5>
                  <div className="flex flex-wrap gap-2">
                    {wordData.syllables.map((syllable, syllableIndex) => {
                      const syllableScore = syllable.pronunciationAssessment.accuracyScore;
                      
                      return (
                        <motion.div
                          key={syllableIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * syllableIndex }}
                          className={cn(
                            'px-2 py-1 rounded-md text-xs font-medium',
                            getScoreBgColor(syllableScore),
                            getScoreColor(syllableScore)
                          )}
                        >
                          {syllable.syllable} ({Math.round(syllableScore)})
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recognition Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-lg bg-gray-50 p-3"
      >
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Recognition Details</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div><span className="font-medium">Recognized:</span> {nBest.display}</div>
          <div><span className="font-medium">Confidence:</span> {(nBest.confidence * 100).toFixed(1)}%</div>
          <div><span className="font-medium">Duration:</span> {(speechData.duration / 10000000).toFixed(1)}s</div>
          {speechData.snr && (
            <div><span className="font-medium">Signal Quality:</span> {speechData.snr.toFixed(1)} dB</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}; 