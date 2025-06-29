'use client';

import React, { useState, useCallback } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { VoiceAssistant } from '../voice/VoiceAssistant';
import { SelectedTopic } from '../../types';

interface PracticeModalProps {
  selectedTopic: SelectedTopic;
  userName: string;
  onClose: () => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  selectedTopic,
  userName,
  onClose
}) => {
  const [isSubmittingName, setIsSubmittingName] = useState(true);
  const [name, setName] = useState(userName);
  const [token, setToken] = useState<string | null>(null);

  const getToken = useCallback(async (userNameParam: string) => {
    try {
      let url = `http://localhost:5001/getToken?name=${encodeURIComponent(userNameParam)}`;
      
      if (selectedTopic) {
        url += `&category_id=${selectedTopic.categoryId}&topic_id=${selectedTopic.topicId}`;
      }
      
      console.log('📡 Fetching token from server.py:', url);
      const response = await fetch(url);
      const tokenData = await response.text();
      setToken(tokenData);
      setIsSubmittingName(false);
      console.log('✅ Token received for English practice:', userNameParam);
    } catch (error) {
      console.error("❌ Error getting token:", error);
    }
  }, [selectedTopic]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      getToken(name);
    }
  };

  const handleDisconnect = () => {
    onClose();
    setIsSubmittingName(true);
    setToken(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {isSubmittingName ? (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-black mb-2">
                  🎯 {selectedTopic.topicName} - Luyện tập
                </h2>
                <p className="text-neutral-dark-gray">
                  Sẵn sàng luyện tập {selectedTopic.topicName}? Nhập tên để kết nối với AI tutor.
                </p>
              </div>
              
              {selectedTopic && (
                <div className="bg-primary-green-light rounded-lg p-6 space-y-4">
                  <div>
                    <strong className="text-neutral-charcoal">Chủ đề đã chọn:</strong> 
                    <span className="ml-2 text-neutral-black">{selectedTopic.topicName}</span>
                  </div>
                  <div>
                    <strong className="text-neutral-charcoal">Danh mục:</strong> 
                    <span className="ml-2 text-neutral-black">{selectedTopic.categoryName}</span>
                  </div>
                  <div>
                    <strong className="text-neutral-charcoal">Mô tả:</strong>
                    <p className="text-neutral-dark-gray mt-1">{selectedTopic.description}</p>
                  </div>
                  <div>
                    <strong className="text-neutral-charcoal">Nhiệm vụ luyện tập:</strong>
                    <ul className="mt-2 space-y-1">
                      {selectedTopic.tasks.map((task, index) => (
                        <li key={index} className="flex items-start gap-2 text-neutral-dark-gray">
                          <span className="text-primary-green font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tên của bạn"
                  required
                  className="w-full px-4 py-3 border border-neutral-medium-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-green text-white py-3 rounded-lg font-semibold hover:bg-primary-green-hover transition-colors"
                  >
                    🎤 Kết nối với AI Tutor
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-neutral-medium-gray text-neutral-dark-gray rounded-lg font-semibold hover:bg-neutral-light-gray transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          ) : token ? (
            <div className="h-[70vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-black">
                  🎤 Đang luyện tập: {selectedTopic.topicName}
                </h2>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  ⏹️ Kết thúc
                </button>
              </div>
              
              <LiveKitRoom
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880'}
                token={token}
                connect={true}
                video={false}
                audio={true}
                onDisconnected={handleDisconnect}
                className="h-full"
              >
                <RoomAudioRenderer />
                <VoiceAssistant selectedTopic={selectedTopic} />
              </LiveKitRoom>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PracticeModal; 