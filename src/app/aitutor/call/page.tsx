'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import NoSSR from '@/shared/components/common/NoSSR';
import { VoiceAssistant } from '@/modules/aitutor/components/voice/VoiceAssistant';
import { ConnectingState } from '@/modules/aitutor/components/voice/ConnectingState';
import { SelectedTopic } from '@/modules/aitutor/types';

function CallPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTopic, setSelectedTopic] = useState<SelectedTopic | null>(null);
  const [userName, setUserName] = useState('Student');
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Extract topic data from URL params
  useEffect(() => {
    const topicData = searchParams.get('topic');
    const userNameParam = searchParams.get('userName');
    
    if (topicData) {
      try {
        const parsedTopic = JSON.parse(decodeURIComponent(topicData));
        setSelectedTopic(parsedTopic);
      } catch (error) {
        console.error('Error parsing topic data:', error);
        router.push('/aitutor');
      }
    } else {
      router.push('/aitutor');
    }

    if (userNameParam) {
      setUserName(decodeURIComponent(userNameParam));
    }
  }, [searchParams, router]);

  const handleStartCall = useCallback(async () => {
    if (!selectedTopic) return;
    
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      let tokenUrl = `http://localhost:5001/getToken?name=${encodeURIComponent(userName)}`;
      tokenUrl += `&category_id=${selectedTopic.categoryId}&topic_id=${selectedTopic.topicId}`;
      
      const tokenResponse = await fetch(tokenUrl);
      if (!tokenResponse.ok) {
        throw new Error('Failed to get token');
      }
      const tokenData = await tokenResponse.text();
      
      const roomName = `practice-${selectedTopic.categoryId}-${selectedTopic.topicId}`;
      
      try {
        await fetch('http://localhost:5001/startAgent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      } catch {
        console.log('⚠️ Could not start agent, continuing without agent context');
      }
      
      setToken(tokenData);
    } catch (error) {
      console.error("❌ Error starting practice session:", error);
      setConnectionError('Failed to connect to the voice assistant. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  }, [selectedTopic, userName]);

  // Auto-start call when component mounts and topic is available
  useEffect(() => {
    if (selectedTopic && !token && !isConnecting && !connectionError) {
      handleStartCall();
    }
  }, [selectedTopic, token, isConnecting, connectionError, handleStartCall]);

  const handleEndCall = () => {
    router.push('/aitutor');
  };

  const handleRetry = () => {
    setConnectionError(null);
    handleStartCall();
  };

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show connection error state
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <h1 className="text-white font-semibold text-lg">{selectedTopic.topicName}</h1>
                <p className="text-gray-400 text-sm">Connection Failed</p>
              </div>
            </div>
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              Back
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-center text-white max-w-md px-6">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Connection Failed</h2>
            <p className="text-gray-300 mb-8">{connectionError}</p>
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-primary-green hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={handleEndCall}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
              >
                Back to Topics
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show connecting state while establishing connection
  if (isConnecting || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <div>
                <h1 className="text-white font-semibold text-lg">{selectedTopic.topicName}</h1>
                <p className="text-gray-400 text-sm">Connecting...</p>
              </div>
            </div>
            <button
              onClick={handleEndCall}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-80px)]">
          <ConnectingState selectedTopic={selectedTopic} />
        </div>
      </div>
    );
  }

  // Show connected voice assistant interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-primary-green rounded-full animate-pulse"></div>
            <div>
              <h1 className="text-white font-semibold text-lg">{selectedTopic.topicName}</h1>
              <p className="text-gray-400 text-sm">{selectedTopic.categoryName} • Connected</p>
            </div>
          </div>
          <button
            onClick={handleEndCall}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            End Call
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-80px)]">
        <LiveKitRoom
          key={`${token}-${selectedTopic.topicId}`}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880'}
          token={token}
          connect={!!token && !!selectedTopic}
          video={false}
          audio={true}
          onDisconnected={handleEndCall}
          onError={handleEndCall}
          className="h-full"
        >
          <RoomAudioRenderer />
          <VoiceAssistant 
            selectedTopic={selectedTopic} 
            onStartCall={() => {}} 
            isConnecting={false} 
            isConnected={true}
          />
        </LiveKitRoom>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function AITutorCallPage() {
  return (
    <NoSSR>
      <Suspense fallback={<LoadingFallback />}>
        <CallPageContent />
      </Suspense>
    </NoSSR>
  );
} 