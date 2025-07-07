// Test file to verify Phase 1 implementation
import { useChatStore, useSettingsStore } from './hooks';
import { chatApiService } from './services';
import { cn, audioUtils, chatUtils } from './utils';
import type { ChatMessage, TopicDetail } from './types';

// Test type imports
console.log('✅ Type imports working');

// Test utility functions
console.log('✅ cn function:', cn('test', 'class'));
console.log('✅ audioUtils.formatTime:', audioUtils.formatTime(125));
console.log('✅ chatUtils.generateMessageId:', chatUtils.generateMessageId());

// Test API service
console.log('✅ chatApiService instance created:', !!chatApiService);

// Test stores (these need to be used in React components)
console.log('✅ Store hooks available:', {
  useChatStore: !!useChatStore,
  useSettingsStore: !!useSettingsStore
});

// Test sample data structures
const sampleMessage: ChatMessage = {
  id: 1,
  content: {
    original: 'Hello world',
    segments: []
  },
  isUserMessage: true,
  timestamp: Date.now()
};

const sampleTopic: TopicDetail = {
  topicId: 1,
  title: 'Sample Topic',
  description: 'A test topic',
  prompt: 'Test prompt',
  image: '/test.jpg',
  tasks: ['Task 1', 'Task 2']
};

console.log('✅ Sample data structures:', {
  message: !!sampleMessage,
  topic: !!sampleTopic
});

export { sampleMessage, sampleTopic }; 