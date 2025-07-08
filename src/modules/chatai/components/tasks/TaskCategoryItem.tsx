'use client';

import React, { useState } from 'react';
import { TaskCategory } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskCategoryItemProps {
  category: TaskCategory;
}

export function TaskCategoryItem({ category }: TaskCategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(category.isExpanded);

  const completedTasks = category.tasks.filter(task => task.status === 'completed').length;
  const totalTasks = category.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      {/* Category Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-100 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{category.icon}</span>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">{category.name}</h3>
            <div className="text-sm text-gray-600">
              {completedTasks}/{totalTasks} completed
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Tasks List */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2">
          {category.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}