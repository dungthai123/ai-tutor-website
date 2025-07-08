import React from 'react';
import { motion } from 'framer-motion';
import { ChatHistoryCard } from './ChatHistoryCard';

interface ConversationSummary {
  conversationId: string;
  topicTitle: string;
  messageCount: number;
  lastModified: number;
}

interface ChatHistoryListProps {
  conversations: ConversationSummary[];
  onDelete: (conversationId: string) => void;
  onExport: (conversationId: string) => void;
}

export function ChatHistoryList({ conversations, onDelete, onExport }: ChatHistoryListProps) {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Conversations Found</h2>
        <p className="text-gray-600">
          Your conversation history will appear here once you start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation, index) => (
        <motion.div
          key={conversation.conversationId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ChatHistoryCard
            conversation={conversation}
            onDelete={onDelete}
            onExport={onExport}
          />
        </motion.div>
      ))}
    </div>
  );
} 