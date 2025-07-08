export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number; // 0-100
  examples: string[];
  completedAt?: Date;
}

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  tasks: Task[];
  isExpanded: boolean;
}

export interface TaskCheckRequest {
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
  tasks: Task[];
  userMessage: string;
  topicContext: string;
}

export interface TaskCheckResponse {
  completedTasks: string[]; // Task IDs that were completed
  progressUpdates?: Array<{
    taskId: string;
    progress: number;
  }>;
} 