'use client';

import React from 'react';
import { TaskChecklistPanel } from '../tasks/TaskChecklistPanel';
import { SpeakingHelperPanel } from '../speaking/SpeakingHelperPanel';
import { TaskCategory, TopicDetail } from '../../types';

interface RightSidebarProps {
  taskCategories: TaskCategory[];
  isCheckingTasks?: boolean;
  topicDetail?: TopicDetail | null;
}

export function RightSidebar({ 
  taskCategories, 
  isCheckingTasks = false, 
  topicDetail 
}: RightSidebarProps) {
  return (
    <div className="w-1/2 h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden">
      {/* Task Checklist Panel - Takes up 60% of height */}
      <div className="flex-[3] min-h-0">
        <TaskChecklistPanel 
          taskCategories={taskCategories}
          isCheckingTasks={isCheckingTasks}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200"></div>

      {/* Speaking Helper Panel - Takes up 40% of height */}
      <div className="flex-[2] min-h-0 overflow-y-auto">
        <div className="p-4">
          <SpeakingHelperPanel topicDetail={topicDetail} />
        </div>
      </div>
    </div>
  );
} 