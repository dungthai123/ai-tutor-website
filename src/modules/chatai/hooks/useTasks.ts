'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { TaskCategory, TopicDetail, ChatMessage } from '../types';
import { taskCompletionService } from '../services/task-completion.service';

// Fallback analysis for basic task completion
function analyzeTaskFallback(
  task: { id: string; title: string; },
  conversationHistory: Array<{ role: string; content: string; timestamp: number }>
): number {
  const allUserMessages = conversationHistory
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase())
    .join(' ');
  
  const taskTitle = task.title.toLowerCase();
  
  // Basic patterns for common introduction tasks
  const patterns = {
    name: /我叫|我的名字|my name|tên tôi|名前/i,
    age: /岁|歲|tuổi|years old|age|年齢/i,
    location: /住在|住址|live in|ở|住んで/i,
    occupation: /学生|學生|工作|job|nghề|職業|student|teacher|doctor/i,
    hobby: /喜欢|喜歡|hobby|sở thích|趣味|like|love/i,
  };
  
  let progress = 0;
  

  
  // For introduction tasks, if we have name + age + location, mark as complete
  if ((taskTitle.includes('giới thiệu') || taskTitle.includes('introduce')) && 
      patterns.name.test(allUserMessages) && 
      patterns.age.test(allUserMessages) && 
      patterns.location.test(allUserMessages)) {
    progress = 100;
  }
  
  return Math.min(progress, 100);
}

// Create task categories from topic tasks
const createTasksFromTopic = (topicDetail: TopicDetail | null): TaskCategory[] => {
  if (!topicDetail || !topicDetail.tasks || topicDetail.tasks.length === 0) {
    return [];
  }

  // Convert topic tasks to our task format
  const topicTasks = topicDetail.tasks.map((taskTitle, index) => ({
    id: `task-${index}`,
    title: taskTitle,
    status: 'not_started' as const,
    progress: 0,
    examples: [], // Could be enhanced with examples based on task content
  }));

  // Group tasks into a single category based on the topic
  const taskCategory: TaskCategory = {
    id: 'topic-tasks',
    name: `${topicDetail.title} - Learning Goals`,
    icon: '🎯',
    isExpanded: true,
    tasks: topicTasks,
  };

  return [taskCategory];
};

export function useTasks(topicDetail: TopicDetail | null) {
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
  const [isCheckingTasks, setIsCheckingTasks] = useState(false);
  
  // Track processed messages to avoid duplicate processing
  const processedMessagesRef = useRef<Set<string>>(new Set());
  const lastCheckTimeRef = useRef<number>(0);
  const taskCategoriesRef = useRef<TaskCategory[]>([]);
  
  // Debounce task checking to avoid excessive API calls
  const debouncedCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize tasks when topic changes
  useEffect(() => {
    if (topicDetail) {
      const initialTasks = createTasksFromTopic(topicDetail);
      setTaskCategories(initialTasks);
      taskCategoriesRef.current = initialTasks;
      // Clear processed messages when topic changes
      processedMessagesRef.current.clear();
      console.log('🎯 Initialized tasks from topic:', {
        topicTitle: topicDetail.title,
        topicTasks: topicDetail.tasks,
        createdCategories: initialTasks,
      });
    }
  }, [topicDetail]);

  // Optimized task completion check
  const checkTaskCompletion = useCallback(async (
    messages: ChatMessage[],
    userMessage: string
  ) => {
    if (!topicDetail) return;

    // Prevent duplicate processing of the same message
    if (processedMessagesRef.current.has(userMessage)) {
      console.log('🔄 Message already processed, skipping task check:', userMessage);
      return;
    }

    // Get all tasks and filter out already completed ones
    const allTasks = taskCategoriesRef.current.flatMap(category => category.tasks);
    const incompleteTasks = allTasks.filter(task => task.status !== 'completed');
    
    // If all tasks are completed, skip processing
    if (incompleteTasks.length === 0) {
      console.log('✅ All tasks completed, skipping check');
      processedMessagesRef.current.add(userMessage);
      return;
    }

    // Debounce rapid successive calls
    if (debouncedCheckRef.current) {
      clearTimeout(debouncedCheckRef.current);
    }

    debouncedCheckRef.current = setTimeout(async () => {
      // Check if we've processed this message in the meantime
      if (processedMessagesRef.current.has(userMessage)) {
        return;
      }

      // Rate limiting: don't check more than once every 2 seconds
      const now = Date.now();
      if (now - lastCheckTimeRef.current < 2000) {
        console.log('⏰ Rate limiting: skipping task check (too soon)');
        return;
      }

      setIsCheckingTasks(true);
      lastCheckTimeRef.current = now;
      
      try {
        console.log('🔍 Checking task completion for speech-to-text message:', {
          userMessage,
          topicTitle: topicDetail.title,
          incompleteTasksCount: incompleteTasks.length,
          totalTasksCount: allTasks.length,
          conversationLength: messages.length,
        });

        // Convert messages to the format expected by the API
        const conversationHistory = messages.map(msg => ({
          role: msg.isUserMessage ? 'user' as const : 'assistant' as const,
          content: msg.content.original,
          timestamp: msg.timestamp,
        }));

        console.log('📤 Calling OpenAI for task analysis...');
        
        let result;
        try {
          result = await taskCompletionService.checkTaskCompletion({
            conversationHistory,
            tasks: incompleteTasks, // Only check incomplete tasks
            userMessage,
            topicContext: `${topicDetail.title}: ${topicDetail.description}. Learning objectives: ${topicDetail.tasks.join(', ')}`,
          });
          
          console.log('✅ OpenAI task completion result:', {
            completedTasks: result.completedTasks,
            method: 'openai',
          });
        } catch (error) {
          console.warn('⚠️ OpenAI analysis failed, using fallback:', error);
          
          // Fallback analysis only for incomplete tasks
          const fallbackResults = incompleteTasks.map(task => {
            const progress = analyzeTaskFallback(task, conversationHistory);
            if (progress >= 100) {
              return task.id;
            }
            return null;
          }).filter(Boolean);

          result = {
            completedTasks: fallbackResults,
          };
          
          console.log('🔄 Fallback analysis results:', {
            completedTasks: result.completedTasks,
            method: 'fallback',
          });
        }

        // Only update if there are actual changes
        if (result.completedTasks.length > 0) {
          setTaskCategories(prevCategories => {
            const updatedCategories = prevCategories.map(category => ({
              ...category,
              tasks: category.tasks.map(task => {
                // Check if task was completed
                if (result.completedTasks.includes(task.id) && task.status !== 'completed') {
                  console.log(`🎉 Task completed: ${task.title}`);
                  return {
                    ...task,
                    status: 'completed' as const,
                    progress: 100,
                    completedAt: new Date(),
                  };
                }

                return task;
              }),
            }));
            
            // Update the ref to keep it in sync
            taskCategoriesRef.current = updatedCategories;
            return updatedCategories;
          });
        }

        // Mark message as processed
        processedMessagesRef.current.add(userMessage);
        
      } catch (error) {
        console.error('Failed to check task completion:', error);
      } finally {
        setIsCheckingTasks(false);
      }
    }, 500); // 500ms debounce
  }, [topicDetail]);



  // Get overall progress statistics
  const getProgressStats = useCallback(() => {
    const allTasks = taskCategories.flatMap(category => category.tasks);
    const completedTasks = allTasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = allTasks.filter(task => task.status === 'in_progress').length;
    
    return {
      total: allTasks.length,
      completed: completedTasks,
      inProgress: inProgressTasks,
      notStarted: allTasks.length - completedTasks - inProgressTasks,
      completionPercentage: allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0,
    };
  }, [taskCategories]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debouncedCheckRef.current) {
        clearTimeout(debouncedCheckRef.current);
      }
    };
  }, []);

  return {
    taskCategories,
    isCheckingTasks,
    checkTaskCompletion,
    getProgressStats,
  };
} 