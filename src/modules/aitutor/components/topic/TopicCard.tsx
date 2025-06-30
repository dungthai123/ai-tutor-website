import React from 'react';
import Image from 'next/image';
import { Topic } from '../../types';
import { getImageUrl, handleImageError } from '../../utils';

interface TopicCardProps {
  topic: Topic;
  isSelected: boolean;
  onSelect: (topic: Topic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected,
  onSelect
}) => {
  const onImageError = () => handleImageError(topic.title);

  return (
    <div
      className={`bg-background-card rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 animate-in fade-in-0 slide-in-from-bottom-4 ${
        isSelected
          ? 'border-accent-primary shadow-glow'
          : 'border-border-subtle hover:border-accent-primary hover:bg-background-hover'
      }`}
      onClick={() => onSelect(topic)}
    >
      {topic.image_url && (
        <div className="relative h-56 bg-background-tertiary overflow-hidden">
          <Image 
            src={getImageUrl(topic.image_url)}
            alt={topic.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={onImageError}
          />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-semibold text-text-primary mb-2 text-sm">
          {topic.title}
        </h4>
        <p className="text-xs text-text-secondary mb-2">
          {topic.description}
        </p>
      </div>
    </div>
  );
}; 