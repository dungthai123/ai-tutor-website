import { TaskCheckRequest, TaskCheckResponse } from '../types';

class TaskCompletionService {
  private readonly baseUrl = '/api/task-completion';

  async checkTaskCompletion(request: TaskCheckRequest): Promise<TaskCheckResponse> {
    try {
      console.log('🔍 Checking task completion with:', request);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Task completion check result:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Task completion check failed:', error);
      // Return empty result on error
      return {
        completedTasks: [],
      };
    }
  }
}

export const taskCompletionService = new TaskCompletionService(); 