/**
 * Timer service for managing test timing
 */
export class TimerService {
  private static timers = new Map<string, NodeJS.Timeout>();

  /**
   * Start a timer for a test session
   */
  static startTimer(
    sessionId: string,
    onTick: (elapsed: number) => void,
    interval: number = 1000
  ): void {
    this.stopTimer(sessionId); // Clear any existing timer
    
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      onTick(elapsed);
    }, interval);

    this.timers.set(sessionId, timer);
  }

  /**
   * Stop timer for a test session
   */
  static stopTimer(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(sessionId);
    }
  }

  /**
   * Stop all timers (cleanup)
   */
  static stopAllTimers(): void {
    for (const [sessionId] of this.timers) {
      this.stopTimer(sessionId);
    }
  }

  /**
   * Format time in seconds to MM:SS format
   */
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
} 