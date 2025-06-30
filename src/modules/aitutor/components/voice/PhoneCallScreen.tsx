'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCallScreenProps } from '../../types';
import { getButtonClasses } from '../../utils';

export function PhoneCallScreen({ 
  selectedTopic, 
  onAccept, 
  onDecline 
}: PhoneCallScreenProps) {
  const [isRinging, setIsRinging] = useState(true);

  const handleAccept = () => {
    console.log('📞 Accept button clicked');
    setIsRinging(false);
    setTimeout(() => {
      console.log('📞 Calling onAccept after timeout');
      onAccept();
    }, 500);
  };

  const handleDecline = () => {
    console.log('📞 Decline button clicked');
    onDecline();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary-green rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center p-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-green rounded-full"></div>
          <span>AI English Tutor</span>
        </div>
        <div className="flex items-center gap-1">
          <span>●●●●●</span>
          <span className="ml-2">📶</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Incoming Call Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">AI English Tutor</h2>
          <p className="text-primary-green text-lg font-medium">
            {selectedTopic.topicName}
          </p>
        </motion.div>

        {/* Avatar with Pulsing Ring */}
        <div className="relative mb-12">
          <motion.div
            animate={isRinging ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-primary-green rounded-full blur-md"
            style={{ transform: 'scale(1.5)' }}
          />
          <div className="relative w-32 h-32 bg-gradient-to-br from-primary-green to-green-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🤖</span>
          </div>
        </div>

        {/* Topic Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 max-w-md"
        >
          <h3 className="text-xl font-semibold text-white mb-3">Ready to Practice?</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {selectedTopic.description}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>📚 {selectedTopic.categoryName}</span>
            <span>•</span>
            <span>🎯 {selectedTopic.tasks.length} tasks</span>
          </div>
        </motion.div>

        {/* Ringing Animation */}
        {isRinging && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-primary-green">
              <span className="text-2xl">📞</span>
              <span className="text-lg font-medium">Ringing...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-8 relative z-10">
        <div className="flex items-center justify-center gap-12">
          {/* Decline Button */}
          <button
            onClick={handleDecline}
            className={getButtonClasses('icon-error')}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-2xl text-white pointer-events-none">📞</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            className={getButtonClasses('icon-success')}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-3xl text-white pointer-events-none">📞</span>
          </button>
        </div>

        {/* Action Labels */}
        <div className="flex items-center justify-center gap-12 mt-4">
          <span className="text-red-400 text-sm">Decline</span>
          <span className="text-primary-green text-sm font-medium">Accept</span>
        </div>
      </div>
    </div>
  );
} 