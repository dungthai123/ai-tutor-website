import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/modules/chatai/hooks';
import { cn } from '@/modules/chatai/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    isSeparateWordOn,
    selectedSpeechRate,
    selectedFontSize,
    isAutoPlayTTS,
    setSeparateWordOn,
    setSpeechRate,
    setFontSize,
    setAutoPlayTTS,
  } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Separate Words Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Separate Words</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={isSeparateWordOn}
                  onChange={(e) => setSeparateWordOn(e.target.checked)}
                  className="sr-only"
                />
                <div className={cn(
                  'h-6 w-11 rounded-full transition-colors',
                  isSeparateWordOn ? 'bg-blue-500' : 'bg-gray-300'
                )}>
                  <div className={cn(
                    'h-5 w-5 transform rounded-full bg-white transition-transform mt-0.5',
                    isSeparateWordOn ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </div>
              </label>
            </div>

            {/* Auto Play TTS Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Auto Play TTS</span>
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

            {/* Speech Rate Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Speech Rate</span>
                <span className="text-sm text-gray-500">{selectedSpeechRate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={selectedSpeechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Font Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Font Size</span>
                <span className="text-sm text-gray-500">{selectedFontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={selectedFontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 