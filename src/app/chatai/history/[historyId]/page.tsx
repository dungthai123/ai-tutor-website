'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { LoadingOverlay, ErrorState } from '@/modules/chatai/components/ui';
import { MessageBubble } from '@/modules/chatai/components/messages';
import { useChatStorage } from '@/modules/chatai/hooks/storage/use-chat-storage';
import { ChatMessage, TopicDetail } from '@/modules/chatai/types';
import { ArrowLeft, Download, Trash2, Calendar, Hash, MessageSquare } from 'lucide-react';

interface ConversationDetailPageProps {
  params: Promise<{ historyId: string }>;
}

interface ConversationData {
  messages: ChatMessage[];
  topicDetail: TopicDetail | null;
  conversationId: string;
  timestamp: number;
}

export default function ConversationDetailPage({ params }: ConversationDetailPageProps) {
  const resolvedParams = React.use(params);
  const historyId = resolvedParams.historyId;
  const router = useRouter();

  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    loadConversation,
    deleteConversation,
    exportConversation,
  } = useChatStorage();

  // Load conversation data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await loadConversation(historyId);
        if (data) {
          setConversationData(data);
        } else {
          setError('Conversation not found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (historyId) {
      loadData();
    }
  }, [historyId, loadConversation]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this conversation? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        await deleteConversation(historyId);
        router.push('/chatai/history');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete conversation';
        setError(errorMessage);
      }
    }
  };

  const handleExport = async () => {
    try {
      const exportData = await exportConversation(historyId);
      if (exportData) {
        // Create download link
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `conversation-${historyId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export conversation';
      setError(errorMessage);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingOverlay message="Loading conversation..." />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <ErrorState 
          error={error} 
          onBack={() => router.push('/chatai/history')}
        />
      </MainLayout>
    );
  }

  if (!conversationData) {
    return (
      <MainLayout>
        <ErrorState 
          error="Conversation not found" 
          onBack={() => router.push('/chatai/history')}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/chatai/history"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {conversationData.topicDetail?.title || 'Conversation Details'}
                </h1>
                <p className="text-gray-600">
                  {conversationData.topicDetail?.description || 'View your saved conversation'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Conversation Metadata */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">Topic:</span>
              <span>{conversationData.topicDetail?.title || 'Unknown'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="font-medium">Messages:</span>
              <span>{conversationData.messages.length}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Date:</span>
              <span>{formatDate(conversationData.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversation History</h2>
            
            {conversationData.messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages in this conversation.
              </div>
            ) : (
              <div className="space-y-4">
                {conversationData.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 