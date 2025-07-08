import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, Hash, Trash2, Download, Eye } from 'lucide-react';

interface ConversationSummary {
  conversationId: string;
  topicTitle: string;
  messageCount: number;
  lastModified: number;
}

interface ChatHistoryCardProps {
  conversation: ConversationSummary;
  onDelete: (conversationId: string) => void;
  onExport: (conversationId: string) => void;
}

export function ChatHistoryCard({ conversation, onDelete, onExport }: ChatHistoryCardProps) {
  const { conversationId, topicTitle, messageCount, lastModified } = conversation;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getMessageCountColor = (count: number) => {
    if (count >= 20) return 'text-green-600 bg-green-50';
    if (count >= 10) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6"
    >
      <div className="flex items-center justify-between">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {topicTitle}
              </h3>

              {/* Metadata */}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                {/* Message Count */}
                <div className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMessageCountColor(messageCount)}`}>
                    {messageCount} messages
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(lastModified)}</span>
                </div>

                {/* Conversation ID (truncated) */}
                <div className="hidden sm:block text-xs text-gray-400 font-mono">
                  ID: {conversationId.slice(0, 8)}...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {/* View Button */}
          <Link
            href={`/chatai/history/${conversationId}`}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View conversation"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {/* Export Button */}
          <button
            onClick={() => onExport(conversationId)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Export conversation"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(conversationId)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
} 