import { TestHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'test-history';

/**
 * HistoryService - handles client-side persistence of completed tests in localStorage
 */
export class HistoryService {
  /**
   * Save a completed test to history (prepends newest first)
   */
  static saveTestToHistory(item: TestHistoryItem): void {
    if (typeof window === 'undefined') return; // SSR safeguard

    try {
      const existing = this.getTestHistory();
      const updated = [item, ...existing];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save test history:', error);
    }
  }

  /**
   * Get full history list (newest first)
   */
  static getTestHistory(): TestHistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to read test history:', error);
      return [];
    }
  }

  /**
   * Get a single test result by historyId
   */
  static getTestResultByHistoryId(historyId: string): TestHistoryItem | undefined {
    const all = this.getTestHistory();
    return all.find(item => item.historyId === historyId);
  }

  /**
   * Optional: clear all history (for debugging / user action)
   */
  static clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  /**
   * Delete a single history entry by historyId
   */
  static deleteHistoryById(historyId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = this.getTestHistory();
      const updated = existing.filter(item => item.historyId !== historyId);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to delete test history entry:', error);
    }
  }
} 