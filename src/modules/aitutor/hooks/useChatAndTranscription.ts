import { useMemo } from 'react';
import {
  type ReceivedChatMessage,
  useChat,
  useRoomContext,
  useVoiceAssistant,
  useTrackTranscription,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from 'livekit-client';

interface TranscriptionSegment {
  id?: string;
  text?: string;
  firstReceivedTime?: number;
}

interface RoomContext {
  localParticipant?: { identity?: string };
}

/**
 * Convert transcription segment to chat message format
 */
function createChatMessageFromTranscription(
  transcription: TranscriptionSegment,
  room: RoomContext | null,
  isAgent: boolean = false
): ReceivedChatMessage {
  console.log('transcription', transcription);
  return {
    id: transcription.id || `transcription-${Date.now()}-${Math.random()}`,
    message: transcription.text || '',
    timestamp: transcription.firstReceivedTime || Date.now(),
    from: {
      identity: isAgent ? 'agent' : room?.localParticipant?.identity || 'user',
      name: isAgent ? 'AI Tutor' : 'You',
      isLocal: !isAgent,
    } as ReceivedChatMessage['from']
  };
}

/**
 * Custom hook for managing chat messages and transcriptions
 * Combines agent transcriptions, user transcriptions, and chat messages
 */
export function useChatAndTranscription() {
  // LiveKit hooks
  const { agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });
  const chat = useChat();
  const room = useRoomContext();

  // Combine all message sources into a single sorted array
  const messages = useMemo(() => {
    try {
      const allMessages: ReceivedChatMessage[] = [];

      // Add agent transcriptions
      if (agentTranscriptions?.length) {
        agentTranscriptions.forEach((transcription) => {
          allMessages.push(createChatMessageFromTranscription(transcription, room, true));
        });
      }

      // Add user transcriptions
      if (userTranscriptions?.length) {
        userTranscriptions.forEach((transcription) => {
          allMessages.push(createChatMessageFromTranscription(transcription, room, false));
        });
      }

      // Add chat messages
      if (chat.chatMessages?.length) {
        allMessages.push(...chat.chatMessages);
          }

      // Sort messages by timestamp
      return allMessages.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Error processing messages:', error);
      return [];
    }
  }, [agentTranscriptions, userTranscriptions, chat.chatMessages, room]);

  // Enhanced send function with error handling
  const sendMessage = async (message: string): Promise<void> => {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      await chat.send(message);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  };

  return { 
    messages, 
    send: sendMessage,
    isSending: chat.isSending 
  };
} 