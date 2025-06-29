'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SelectedTopic } from '../../types';

interface ChatEmptyStateProps {
  selectedTopic: SelectedTopic;
  variant?: 'default' | 'compact';
}

export function ChatEmptyState({ selectedTopic, variant = 'default' }: ChatEmptyStateProps) {
  const styles = {
    default: {
      container: 'text-center py-12 flex-shrink-0',
      icon: 'text-9xl mb-8',
      title: 'text-3xl font-bold text-white mb-6 drop-shadow-lg',
      description: 'text-white max-w-lg mx-auto text-xl font-medium drop-shadow-md',
      tasksContainer: 'mt-10 p-8 bg-gray-800 rounded-xl max-w-lg mx-auto border border-gray-700',
      tasksTitle: 'font-bold text-white mb-4 text-xl',
      tasksList: 'space-y-4',
      taskItem: 'flex items-start gap-4 text-lg text-white',
      taskDot: 'w-3 h-3 bg-primary-green rounded-full mt-2 flex-shrink-0'
    },
    compact: {
      container: 'text-center py-8',
      icon: 'text-4xl mb-4',
      title: 'text-lg font-semibold text-white mb-4',
      description: 'text-gray-300 text-sm max-w-xs mx-auto',
      tasksContainer: 'mt-6 space-y-2',
      tasksTitle: 'text-white font-medium text-sm mb-3',
      tasksList: 'space-y-2',
      taskItem: 'flex items-center gap-2 text-xs text-gray-400 justify-center',
      taskDot: 'w-2 h-2 bg-accent-primary rounded-full'
    }
  };

  const currentStyles = styles[variant];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={currentStyles.container}
    >
      <div className={currentStyles.icon}>🎤</div>
      <h4 className={currentStyles.title}>
        Ready to practice!
      </h4>
      <p className={currentStyles.description}>
        {variant === 'default' 
          ? 'Start speaking or type a message to begin your English conversation practice with AI tutor.'
          : 'Start speaking or type a message to begin your conversation.'
        }
      </p>
      
      <div className={currentStyles.tasksContainer}>
        <h5 className={currentStyles.tasksTitle}>
          {variant === 'default' ? 'Practice Tasks:' : 'Quick Start:'}
        </h5>
        <div className={currentStyles.tasksList}>
          {selectedTopic.tasks.slice(0, variant === 'default' ? 3 : 2).map((task, index) => (
            <div key={index} className={currentStyles.taskItem}>
              <span className={currentStyles.taskDot}></span>
              <span className={variant === 'compact' ? 'max-w-[250px] truncate' : 'font-medium'}>
                {task}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
} 