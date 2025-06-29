'use client';

import React, { useState } from 'react';

interface FloatingAction {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  active?: boolean;
}

interface FloatingActionsProps {
  actions?: FloatingAction[];
  position?: 'bottom-right' | 'bottom-left';
}

const defaultActions: FloatingAction[] = [
  {
    id: 'ai-toggle',
    icon: '🤖',
    label: 'Bật/Tắt AI',
    action: () => console.log('Toggle AI'),
    active: true
  },
  {
    id: 'suggestions',
    icon: '💡',
    label: 'Gợi ý',
    action: () => console.log('Show suggestions'),
    active: false
  },
  {
    id: 'feedback',
    icon: '📝',
    label: 'Phản hồi',
    action: () => console.log('Give feedback'),
    active: false
  },
  {
    id: 'language',
    icon: '🌐',
    label: 'Ngôn ngữ',
    action: () => console.log('Switch language'),
    active: false
  }
];

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  actions = defaultActions,
  position = 'bottom-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-16 right-0 bg-neutral-black text-white text-sm px-3 py-2 rounded-md whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-black"></div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {/* Secondary Actions */}
        {isExpanded && actions.slice(1).map((action, index) => (
          <button
            key={action.id}
            onClick={action.action}
            onMouseEnter={() => setTooltip(action.label)}
            onMouseLeave={() => setTooltip(null)}
            className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
              action.active 
                ? 'bg-primary-green text-white' 
                : 'bg-white text-neutral-dark-gray border border-neutral-medium-gray'
            }`}
            style={{
              animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
            }}
          >
            <span className="text-lg">{action.icon}</span>
          </button>
        ))}

        {/* Main Action Button */}
        <button
          onClick={() => {
            if (actions[0]) {
              actions[0].action();
            }
            setIsExpanded(!isExpanded);
          }}
          onMouseEnter={() => setTooltip(actions[0]?.label)}
          onMouseLeave={() => setTooltip(null)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 ${
            actions[0]?.active 
              ? 'bg-primary-green text-white' 
              : 'bg-white text-neutral-dark-gray border border-neutral-medium-gray'
          }`}
        >
          <span className="text-xl">{actions[0]?.icon}</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}; 