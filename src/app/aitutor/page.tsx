'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NoSSR from '@/shared/components/common/NoSSR';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { 
  TopicSelectionPanel,
  VoiceAssistantPanel
} from '@/modules/aitutor/components';
import { SelectedTopic } from '@/modules/aitutor/types';

export default function PracticePage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic | null>(null);
  const [userName, setUserName] = useState('Student');

  const handleTopicSelect = (categoryId: number, topicId: string, topicData: {
    categoryName: string;
    topicName: string;
    description: string;
    tasks: string[];
    imageUrl?: string;
  }) => {
    const topic = {
      categoryId,
      topicId,
      ...topicData
    };

        setSelectedTopic(topic);
    console.log('✅ Topic selected:', topic.topicName);
  };

  const handleStartCall = () => {
    console.log('🚀 handleStartCall called!');
    if (!selectedTopic) {
      console.log('❌ No selected topic');
      return;
    }
    
    // Navigate to call page with topic data
    const topicData = encodeURIComponent(JSON.stringify(selectedTopic));
    const userNameParam = encodeURIComponent(userName);
    router.push(`/aitutor/call?topic=${topicData}&userName=${userNameParam}`);
  };

  const handleDeclineCall = () => {
    console.log('❌ handleDeclineCall called!');
    setSelectedTopic(null);
  };

  return (
    <NoSSR>
      <MainLayout showFloatingActions={false}>
        <div className="min-h-screen bg-background-secondary">
          <div className="w-full py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-6rem)]">
              
              {/* Left Column - Topic Selection (2/3 width) */}
              <div className="lg:col-span-2 h-full overflow-hidden">
                <TopicSelectionPanel
                  userName={userName}
                  onUserNameChange={setUserName}
                  onTopicSelect={handleTopicSelect}
                />
              </div>

              {/* Right Column - Voice Assistant (1/3 width) */}
              <div className="lg:col-span-1 h-full bg-background-card rounded-xl border border-border-subtle overflow-hidden">
                <VoiceAssistantPanel
                  selectedTopic={selectedTopic}
                  userName={userName}
                  token={null}
                  isConnecting={false}
                  onStartCall={handleStartCall}
                  onDeclineCall={handleDeclineCall}
                  onDisconnect={() => {}}
                  onToggleFullScreen={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
              </MainLayout>
    </NoSSR>
  );
} 