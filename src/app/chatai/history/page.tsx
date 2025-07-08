'use client';

import React from 'react';
import Link from 'next/link';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { ChatHistoryList } from '@/modules/chatai/components/history';
import { useChatHistory } from '@/modules/chatai/hooks/history/use-chat-history';
import { LoadingOverlay, ErrorState } from '@/modules/chatai/components/ui';
import { Trash2, Upload, MessageSquare } from 'lucide-react';

interface ConversationSummary {
  conversationId: string;
  topicTitle: string;
  messageCount: number;
  lastModified: number;
}

export default function ChatAIHistoryPage() {
  const {
    conversations,
    loading,
    error,
    refreshHistory,
    deleteConversation,
    clearAllHistory,
    exportConversation,
    importConversation,
  } = useChatHistory();

  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to delete all chat history? This action cannot be undone.'
    );
    
    if (confirmClear) {
      await clearAllHistory();
      refreshHistory();
    }
  };

  const handleDelete = async (conversationId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this conversation?'
    );
    
    if (confirmDelete) {
      await deleteConversation(conversationId);
      refreshHistory();
    }
  };

  const handleExport = async (conversationId: string) => {
    const exportData = await exportConversation(conversationId);
    if (exportData) {
      // Create download link
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chat-history-${conversationId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const newConversationId = await importConversation(text);
      
      if (newConversationId) {
        refreshHistory();
        alert('Conversation imported successfully!');
      } else {
        alert('Failed to import conversation. Please check the file format.');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import conversation. Invalid file format.');
    }
    
    // Clear the input
    event.target.value = '';
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingOverlay message="Loading chat history..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorState error={error} onBack={refreshHistory} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chat AI History</h1>
                <p className="text-gray-600">View and manage your saved conversations</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Import Button */}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Clear All Button */}
              {conversations.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        {conversations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {conversations.length}
              </div>
              <div className="text-sm text-gray-600">Total Conversations</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {conversations.reduce((sum: number, conv: ConversationSummary) => sum + conv.messageCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(conversations.map((conv: ConversationSummary) => conv.topicTitle)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Topics</div>
            </div>
          </div>
        )}

        {/* Content */}
        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Conversations Yet</h2>
            <p className="text-gray-600 mb-6">
              Start chatting with AI to see your conversation history here.
            </p>
            <Link
              href="/chatai"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Start New Conversation
            </Link>
          </div>
        ) : (
          <ChatHistoryList
            conversations={conversations}
            onDelete={handleDelete}
            onExport={handleExport}
          />
        )}
      </div>
    </MainLayout>
  );
} 