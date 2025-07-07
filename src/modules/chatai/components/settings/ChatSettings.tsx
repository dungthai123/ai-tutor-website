"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Type, Clock, Mic, Languages, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../../hooks/storage/settings-store';
import { cn } from '../../utils';

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({ isOpen, onClose }) => {
  const {
    isSeparateWordOn,
    isMusicBackgroundTurnOn,
    selectedSpeechRate,
    selectedFontSize,
    isAutoPlayTTS,
    language,
    setSeparateWordOn,
    setMusicBackgroundTurnOn,
    setSpeechRate,
    setFontSize,
    setAutoPlayTTS,
    setLanguage,
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Chat Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {/* Audio Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Audio</h3>
              </div>

              {/* Auto Play TTS */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">Auto Play TTS</p>
                  <p className="text-sm text-gray-500">Automatically play audio for bot messages</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isAutoPlayTTS}
                    onChange={(e) => setAutoPlayTTS(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    'h-6 w-11 rounded-full transition-colors',
                    isAutoPlayTTS ? 'bg-blue-500' : 'bg-gray-300'
                  )}>
                    <div className={cn(
                      'h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5',
                      isAutoPlayTTS ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </div>
                </label>
              </div>

              {/* Background Music */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">Background Music</p>
                  <p className="text-sm text-gray-500">Play ambient music during conversations</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isMusicBackgroundTurnOn}
                    onChange={(e) => setMusicBackgroundTurnOn(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    'h-6 w-11 rounded-full transition-colors',
                    isMusicBackgroundTurnOn ? 'bg-blue-500' : 'bg-gray-300'
                  )}>
                    <div className={cn(
                      'h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5',
                      isMusicBackgroundTurnOn ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </div>
                </label>
              </div>

              {/* Speech Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700">Speech Rate</p>
                    <p className="text-sm text-gray-500">Adjust TTS playback speed</p>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{selectedSpeechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={selectedSpeechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900">Display</h3>
              </div>

              {/* Separate Words */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">Separate Words</p>
                  <p className="text-sm text-gray-500">Show word segmentation in messages</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isSeparateWordOn}
                    onChange={(e) => setSeparateWordOn(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    'h-6 w-11 rounded-full transition-colors',
                    isSeparateWordOn ? 'bg-green-500' : 'bg-gray-300'
                  )}>
                    <div className={cn(
                      'h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5',
                      isSeparateWordOn ? 'translate-x-5' : 'translate-x-0.5'
                    )} />
                  </div>
                </label>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700">Font Size</p>
                    <p className="text-sm text-gray-500">Adjust text size in messages</p>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{selectedFontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={selectedFontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>12px</span>
                  <span>18px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-900">Language</h3>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <p className="text-gray-700">Interface Language</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-medium text-gray-900">Preview</h3>
              </div>

              {/* Sample Text */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p 
                  className="text-gray-800"
                  style={{ fontSize: `${selectedFontSize}px` }}
                >
                  {isSeparateWordOn ? (
                    <span>
                      <span className="inline-block mr-1 px-1 py-0.5 rounded bg-blue-100 text-blue-800">Hello</span>
                      <span className="inline-block mr-1 px-1 py-0.5 rounded bg-blue-100 text-blue-800">world!</span>
                    </span>
                  ) : (
                    "Hello world! This is a preview of your message display settings."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// CSS for custom slider styling
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
} 