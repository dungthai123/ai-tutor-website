import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { HSKLevel } from '../types';

const getTimerDuration = (level: HSKLevel): number => {
  // HSK4-6: 40 minutes, HSK1-3: 30 minutes
  return (level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6) 
    ? 2400 // 40 minutes in seconds
    : 1800; // 30 minutes in seconds
};

interface TimerState {
  currentTime: number;
  totalTime: number;
  isTimerRunning: boolean;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  updateTimer: (onComplete: () => void) => void;
  resetTimer: (level: HSKLevel) => void;
  initTimer: (level: HSKLevel) => void;
}

export const useTimerStore = create<TimerState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentTime: 0,
      totalTime: 1800,
      isTimerRunning: false,
      
      // Actions
      startTimer: () => set({ isTimerRunning: true }),
      
      pauseTimer: () => set({ isTimerRunning: false }),
      
      updateTimer: (onComplete) => {
        const state = get();
        if (state.isTimerRunning) {
          const newTime = state.currentTime + 1;
          
          if (newTime >= state.totalTime) {
            set({ isTimerRunning: false });
            onComplete();
          } else {
            set({ currentTime: newTime });
          }
        }
      },
      
      resetTimer: (level) => {
        const totalTime = getTimerDuration(level);
        set({ 
          currentTime: 0, 
          totalTime, 
          isTimerRunning: false 
        });
      },
      
      initTimer: (level) => {
        const totalTime = getTimerDuration(level);
        set({ 
          currentTime: 0, 
          totalTime, 
          isTimerRunning: false 
        });
      }
    }),
    { name: 'timer-store' }
  )
); 