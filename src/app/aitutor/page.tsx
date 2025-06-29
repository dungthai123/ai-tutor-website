'use client';

import React, { useState, useEffect } from 'react';
import NoSSR from '@/shared/components/common/NoSSR';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { 
  FullScreenLayout,
  TopicSelectionPanel,
  VoiceAssistantPanel,
  TopicDetailsPanel
} from '@/modules/aitutor/components';
import { SelectedTopic } from '@/modules/aitutor/types';

export default function PracticePage() {
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic | null>(null);
  const [userName, setUserName] = useState('Student');
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Full-screen mode state management
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleTopicSelect = (categoryId: number, topicId: string, topicData: {
    categoryName: string;
    topicName: string;
    description: string;
    tasks: string[];
    imageUrl?: string;
  }) => {
    // If we're currently connected, disconnect first
    if (token) {
      console.log('🔄 Disconnecting current session before selecting new topic');
      handleDisconnect();
      
      // Wait a bit before selecting new topic to allow cleanup
      setTimeout(() => {
        const topic = {
          categoryId,
          topicId,
          ...topicData
        };
        
        setSelectedTopic(topic);
        console.log('✅ Topic selected:', topic.topicName);
      }, 200);
    } else {
      // No active connection, select immediately
    const topic = {
      categoryId,
      topicId,
      ...topicData
    };
    
    setSelectedTopic(topic);
      console.log('✅ Topic selected:', topic.topicName);
    }
  };

  const handleStartCall = async () => {
    console.log('🚀 handleStartCall called!');
    if (!selectedTopic) {
      console.log('❌ No selected topic');
      return;
    }
    
    console.log('🔄 Setting isConnecting to true');
    setIsConnecting(true);
    
    try {
      // Step 1: Get token from server.py
      let tokenUrl = `http://localhost:5001/getToken?name=${encodeURIComponent(userName)}`;
      tokenUrl += `&category_id=${selectedTopic.categoryId}&topic_id=${selectedTopic.topicId}`;
      
      console.log('📡 Fetching token from server.py:', tokenUrl);
      const tokenResponse = await fetch(tokenUrl);
      const tokenData = await tokenResponse.text();
      
      // Step 2: Start agent with topic context via server.py
      const roomName = `practice-${selectedTopic.categoryId}-${selectedTopic.topicId}`;
      console.log('🤖 Starting agent for room:', roomName);
      
      try {
        const agentResponse = await fetch('http://localhost:5001/startAgent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomName,
            categoryId: selectedTopic.categoryId,
            topicId: selectedTopic.topicId,
            topicData: {
              topicName: selectedTopic.topicName,
              categoryName: selectedTopic.categoryName,
              description: selectedTopic.description,
              tasks: selectedTopic.tasks
            }
          })
        });
        
        if (agentResponse.ok) {
          const agentResult = await agentResponse.json();
          console.log('🤖 Agent started successfully:', agentResult);
        } else {
          console.log('⚠️ Agent start failed, continuing without agent context');
        }
      } catch (agentError) {
        console.log('⚠️ Could not start agent, continuing without agent context:', agentError);
      }
      
      // Step 3: Set token to connect to room
      setToken(tokenData);
      console.log('✅ Token received and agent started for topic:', selectedTopic.topicName);
      
    } catch (error) {
      console.error("❌ Error starting practice session:", error);
    } finally {
      console.log('🔄 Setting isConnecting to false');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    console.log('🔄 Disconnecting...');
    // First, exit full screen mode
    setIsFullScreen(false);
    
    // Then clear the token after a small delay to allow cleanup
    setTimeout(() => {
      setToken(null);
      setSelectedTopic(null);
      console.log('✅ Disconnection complete');
    }, 100);
  };

  const handleDeclineCall = () => {
    console.log('❌ handleDeclineCall called!');
    setSelectedTopic(null);
  };

  // Trigger full-screen mode when agent is connected
  useEffect(() => {
    if (token && selectedTopic && !isConnecting) {
      // Delay to allow for smooth transition
      setTimeout(() => {
        setIsFullScreen(true);
      }, 500);
    }
  }, [token, selectedTopic, isConnecting]);

  const handleMinimizeFullScreen = () => {
    setIsFullScreen(false);
  };

  // Full-screen mode rendering
  if (isFullScreen && token && selectedTopic) {
    return (
      <FullScreenLayout
        selectedTopic={selectedTopic}
        userName={userName}
        token={token}
        onMinimize={handleMinimizeFullScreen}
        onEndSession={handleDisconnect}
      />
    );
  }

  // Normal 3-panel layout
  return (
    <NoSSR>
      <MainLayout showFloatingActions={false}>
        <div className="min-h-screen bg-background-secondary">
          <div className="w-full py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-6rem)]">
              
              {/* Left Column - Topic Selection (1 unit) */}
              <TopicSelectionPanel
                userName={userName}
                onUserNameChange={setUserName}
                onTopicSelect={handleTopicSelect}
              />

              {/* Middle Column - Voice Assistant (2 units) */}
              <div className="lg:col-span-2 bg-background-card rounded-xl border border-border-subtle overflow-hidden">
                <VoiceAssistantPanel
                  selectedTopic={selectedTopic}
                  userName={userName}
                      token={token}
                  isConnecting={isConnecting}
                  onStartCall={handleStartCall}
                  onDeclineCall={handleDeclineCall}
                  onDisconnect={handleDisconnect}
                  onToggleFullScreen={() => setIsFullScreen(true)}
                />
              </div>

              {/* Right Column - Topic Details (1 unit) */}
              <div className="lg:col-span-1 bg-background-card rounded-xl border border-border-subtle p-4 overflow-y-auto">
                <TopicDetailsPanel
                  selectedTopic={selectedTopic}
                  isConnected={!!token}
                />
              </div>
            </div>
          </div>
        </div>
              </MainLayout>
    </NoSSR>
  );
} 