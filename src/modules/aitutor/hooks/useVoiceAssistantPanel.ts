import { useMemo } from 'react';
import { SelectedTopic } from '../types';
import { VoiceAssistantPanelState } from '../types';

export const useVoiceAssistantPanel = (
  selectedTopic: SelectedTopic | null,
  token: string | null,
  isConnecting: boolean
) => {
  const state = useMemo<VoiceAssistantPanelState>(() => {
    return {
      isConnected: !!(token && selectedTopic && !isConnecting),
      hasError: false,
      errorMessage: undefined
    };
  }, [token, selectedTopic, isConnecting]);

  const getStateType = (): 'empty' | 'connecting' | 'connected' | 'disconnected' | 'error' => {
    // No topic selected
    if (!selectedTopic) {
      return 'empty';
    }

    // Error state
    if (state.hasError) {
      return 'error';
    }

    // Connecting state
    if (isConnecting) {
      return 'connecting';
    }

    // Connected with token
    if (token && selectedTopic && !isConnecting) {
      return 'connected';
    }

    // Topic selected but not connected
    if (selectedTopic && !token) {
      return 'disconnected';
    }

    return 'empty';
  };

  const getEmptyStateConfig = () => {
    const stateType = getStateType();
    
    switch (stateType) {
      case 'empty':
        return {
          title: 'AI English Tutor',
          message: 'Chọn một chủ đề từ danh sách bên trái để bắt đầu luyện tập',
          icon: '🤖'
        };
      case 'error':
        return {
          title: 'Không thể kết nối',
          message: state.errorMessage || 'Có lỗi xảy ra khi kết nối với AI Tutor',
          icon: '❌',
          action: {
            label: 'Thử lại',
            onClick: () => window.location.reload()
          }
        };
      default:
        return null;
    }
  };

  return {
    state,
    stateType: getStateType(),
    emptyStateConfig: getEmptyStateConfig(),
    isConnected: state.isConnected,
    hasError: state.hasError
  };
}; 