'use client';

import React from 'react';
import { SelectedTopic } from '../../types';

interface TopicDetailsPanelProps {
  selectedTopic: SelectedTopic | null;
  isConnected?: boolean;
}

export const TopicDetailsPanel: React.FC<TopicDetailsPanelProps> = ({ 
  selectedTopic, 
  isConnected = false 
}) => {
  if (!selectedTopic) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Chi tiết chủ đề
          </h3>
          <p className="text-text-secondary text-sm">
            Chọn một chủ đề để xem chi tiết và mục tiêu luyện tập
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Topic Header */}
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-2">
          📝 {selectedTopic.topicName}
        </h3>
        <div className="status-indicator status-success">
          {selectedTopic.categoryName}
        </div>
      </div>

      {/* Topic Image */}
      {selectedTopic.imageUrl && (
        <div className="relative h-32 bg-background-tertiary rounded-lg overflow-hidden">
          <img 
            src={selectedTopic.imageUrl.startsWith('http') 
              ? selectedTopic.imageUrl 
              : `https://thinkailabstaging.blob.core.windows.net/trum-chinese${selectedTopic.imageUrl}`
            }
            alt={selectedTopic.topicName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Description */}
      <div>
        <h4 className="font-semibold text-text-primary mb-1 text-sm">📖 Mô tả</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {selectedTopic.description}
        </p>
      </div>

      {/* Practice Tasks */}
      <div>
        <h4 className="font-semibold text-text-primary mb-2 text-sm">🎯 Mục tiêu luyện tập</h4>
        <div className="space-y-2">
          {selectedTopic.tasks.slice(0, 4).map((task, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-background-tertiary rounded-md">
              <div className="w-5 h-5 bg-accent-success text-background-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {task}
              </p>
            </div>
          ))}
          {selectedTopic.tasks.length > 4 && (
            <p className="text-xs text-text-muted text-center">
              +{selectedTopic.tasks.length - 4} mục tiêu khác
            </p>
          )}
        </div>
      </div>

      {/* Practice Tips */}
      <div className="bg-accent-primary/10 border border-accent-primary/20 p-3 rounded-lg">
        <h4 className="font-semibold text-accent-primary mb-1 flex items-center gap-1 text-sm">
          💡 Gợi ý
        </h4>
        <div className="space-y-1 text-xs text-accent-primary">
          <p>• Nói chậm và rõ ràng</p>
          <p>• Sử dụng từ vựng đa dạng</p>
          <p>• Đừng ngại hỏi AI</p>
        </div>
      </div>

      {/* Progress Indicator */}
      {isConnected && (
        <div className="bg-accent-success/10 border border-accent-success/20 p-3 rounded-lg">
          <h4 className="font-semibold text-accent-success mb-1 flex items-center gap-1 text-sm">
            🎤 Trạng thái
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse"></div>
            <span className="text-xs text-accent-success font-medium">
              Đang luyện tập
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicDetailsPanel; 