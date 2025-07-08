'use client';

import React from 'react';
import { TaskCategory } from '../../types';
import { TaskCategoryItem } from '../tasks/TaskCategoryItem';

interface TaskChecklistPanelProps {
  taskCategories: TaskCategory[];
  isCheckingTasks?: boolean;
}

export function TaskChecklistPanel({ taskCategories, isCheckingTasks = false }: TaskChecklistPanelProps) {
  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">Learning Tasks</h2>
          <div className="text-sm text-gray-600">
            {isCheckingTasks ? (
              <span className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                Checking progress...
              </span>
            ) : (
              'Track your progress'
            )}
          </div>
        </div>
      </div>

      {/* Task Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {taskCategories.map((category) => (
          <TaskCategoryItem
            key={category.id}
            category={category}
          />
        ))}
      </div>

      {/* Footer Stats */}
      <div className="h-16 border-t border-gray-200 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-gray-600">
            {taskCategories.reduce((total, cat) => 
              total + cat.tasks.filter(task => task.status === 'completed').length, 0
            )} / {taskCategories.reduce((total, cat) => total + cat.tasks.length, 0)} completed
          </div>
        </div>
      </div>
    </div>
  );
} 