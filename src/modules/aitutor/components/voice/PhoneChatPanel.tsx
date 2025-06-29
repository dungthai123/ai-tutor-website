'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SelectedTopic } from '../../types';

interface PhoneChatPanelProps {
  selectedTopic: SelectedTopic;
  userName: string;
  onMinimize: () => void;
  onEndSession: () => void;
  children: React.ReactNode;
}

export const PhoneChatPanel: React.FC<PhoneChatPanelProps> = ({ 
  selectedTopic, 
  userName, 
  onMinimize, 
  onEndSession, 
  children 
}) => {
  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="w-[575px] h-screen rounded-3xl shadow-2xl flex flex-col overflow-hidden border"
      style={{ 
        background: 'linear-gradient(to bottom right, var(--bg-primary), var(--bg-secondary), var(--bg-tertiary))',
        borderColor: 'var(--border-medium)',
        boxShadow: 'var(--shadow-large)'
      }}
    >
      {/* Phone Header Bar */}
      <div className="h-20 flex items-center justify-between px-6 border-b" style={{ 
        background: 'linear-gradient(to right, var(--bg-tertiary), var(--bg-card))',
        borderBottomColor: 'var(--border-medium)' 
      }}>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-success)' }}></div>
          <div>
            <h3 className="font-semibold text-sm truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>
              {selectedTopic.topicName}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {selectedTopic.categoryName} • {userName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Minimize Button - Secondary Style */}
          <button
            onClick={onMinimize}
            className="btn-icon-secondary"
            title="Minimize"
          >
            <span>⬇️</span>
          </button>
          {/* End Session Button - Error Style */}
          <button
            onClick={onEndSession}
            className="btn-icon-error"
            title="End Session"
          >
            <span>✕</span>
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Phone Status Footer */}
      <div className="h-12 border-t flex items-center justify-between px-6" style={{ 
        backgroundColor: 'var(--bg-tertiary)', 
        borderTopColor: 'var(--border-medium)' 
      }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Connected</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{new Date().toLocaleTimeString([], { timeStyle: 'short' })}</span>
          <span className="ml-2">📶</span>
          <span>🔋</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneChatPanel; 