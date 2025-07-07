# Chat AI Module

A comprehensive real-time conversational AI system with advanced capabilities including voice interaction, pronunciation assessment, background music, hint system, and comprehensive feedback mechanisms.

## 🏗️ Architecture

The Chat AI module follows a clean, modular architecture using Next.js 15 + TypeScript best practices.

### Module Structure

```
src/modules/chatai/
├── components/          # React components (Phase 4)
│   ├── layout/         # Chat layout components
│   ├── messages/       # Message-related components
│   ├── input/          # Input handling components
│   ├── feedback/       # Feedback and improvement components
│   ├── audio/          # Audio-related components
│   ├── settings/       # Settings and configuration
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── storage/        # State management hooks
│   ├── chat/           # Chat logic hooks (Phase 2)
│   ├── audio/          # Audio handling hooks (Phase 3)
│   └── api/            # API communication hooks (Phase 2)
├── services/           # Business logic and data services
│   ├── api/            # API communication services
│   ├── audio/          # Audio processing services (Phase 3)
│   └── storage/        # Data persistence services (Phase 5)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── README.md           # This documentation
```

## 🎯 Key Features

### ✅ Phase 1 Complete: Foundation & Core Infrastructure

- [x] **Type System**: Comprehensive TypeScript interfaces
- [x] **State Management**: Zustand stores with persistence
- [x] **API Services**: Base API service with error handling
- [x] **Chat API**: Complete chat API service implementation
- [x] **Utilities**: Helper functions for audio, chat, format, validation
- [x] **Module Structure**: Clean modular architecture

### 🚧 Upcoming Phases

- **Phase 2**: Core Chat Functionality

  - Multi-modal chat interface (text + voice)
  - Real-time AI conversations
  - Message translation and improvement
  - Conversation hints

- **Phase 3**: Audio System Implementation

  - Voice recording and playback
  - Speech-to-text transcription
  - Text-to-speech synthesis
  - Pronunciation assessment with detailed scoring
  - Background music with controls

- **Phase 4**: UI Components Implementation

  - Chat layout and message bubbles
  - Voice input and text input components
  - Settings menu and feedback displays
  - Loading states and animations

- **Phase 5**: Storage & Data Management
  - IndexedDB for local storage
  - Conversation persistence
  - Chat history management

## 🔧 Current Implementation

### Type System

Comprehensive TypeScript interfaces covering:

- **Chat Types**: Messages, topics, conversations
- **Audio Types**: Speech data, pronunciation assessment
- **API Types**: Request/response interfaces
- **UI State Types**: Loading states, settings
- **Storage Types**: Database entities

### State Management

**Chat Store** (`useChatStore`):

- Message management
- Conversation state
- UI state (keyboard, hints, loading)
- Loading states for async operations

**Settings Store** (`useSettingsStore`):

- User preferences with persistence
- Speech rate, font size, language settings
- Background music and auto-play preferences

### API Services

**Base API Service**:

- Axios configuration with interceptors
- Error handling and response formatting
- Authentication token management

**Chat API Service**:

- Topic fetching and management
- Message sending and receiving
- Translation and improvement services
- Conversation feedback and hints

### Utilities

**Audio Utils**: Time formatting, URL management
**Chat Utils**: Message ID generation, timestamp formatting
**Format Utils**: Text manipulation and formatting
**Validation Utils**: Input validation and type checking
**Error Utils**: Error message extraction and classification

## 🚀 Usage

### Basic Setup

```typescript
import {
  useChatStore,
  useSettingsStore,
  chatApiService,
} from "@/modules/chatai";

function ChatComponent() {
  const chatStore = useChatStore();
  const settingsStore = useSettingsStore();

  // Use the stores and services
}
```

### API Usage

```typescript
import { chatApiService } from "@/modules/chatai";

// Fetch topics
const topics = await chatApiService.fetchTopics();

// Send message
const response = await chatApiService.sendMessage({
  chatSessionId: "session-123",
  message: "Hello!",
});
```

### State Management

```typescript
import { useChatStore } from "@/modules/chatai";

function MessageComponent() {
  const { messages, addMessage, setAwaitingResponse } = useChatStore();

  // Manage chat state
}
```

## 🔄 Implementation Progress

### ✅ Completed (Phase 1)

1. **Project Setup**: Dependencies installed and configured
2. **Module Structure**: Complete directory structure created
3. **Type Definitions**: All interfaces and types defined
4. **Base Services**: API service foundation implemented
5. **State Management**: Zustand stores with persistence
6. **Utilities**: Helper functions for all major operations

### 🎯 Next Steps (Phase 2)

1. **Core Chat Hook**: Main chat logic implementation
2. **Message Management**: Advanced message handling
3. **API Integration**: Complete API hook implementations
4. **Translation Service**: Message translation functionality
5. **Improvement System**: AI-powered message enhancement

## 🛠️ Development Guidelines

### Adding New Features

1. **Components**: Add to appropriate `components/` subdirectory
2. **Hooks**: Create in relevant `hooks/` category
3. **Services**: Extend existing services or create new ones
4. **Types**: Update type definitions as needed

### Testing Strategy

- **Unit Tests**: For individual hooks and services
- **Integration Tests**: For complete chat flows
- **E2E Tests**: For user interaction scenarios

### Performance Considerations

- **Memoization**: Use React.memo for expensive components
- **State Optimization**: Minimize re-renders with focused state slices
- **Audio Management**: Proper cleanup of audio resources
- **Memory Management**: Clean up event listeners and subscriptions

## 📚 Dependencies

### Core Dependencies

- `next`: Next.js 15 framework
- `react`: React 19
- `typescript`: Type safety
- `zustand`: State management
- `axios`: HTTP client

### Audio Dependencies

- `microsoft-cognitiveservices-speech-sdk`: Speech services
- `wavesurfer.js`: Audio visualization

### UI Dependencies

- `tailwindcss`: Styling
- `framer-motion`: Animations
- `lucide-react`: Icons
- `@radix-ui/*`: UI primitives

### Storage Dependencies

- `idb`: IndexedDB wrapper
- `uuid`: Unique ID generation

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user chat sessions
- **Voice Cloning**: Custom voice synthesis
- **Advanced Analytics**: Learning progress tracking
- **Offline Support**: Cached conversations
- **Multi-language Support**: Extended language options
- **AI Tutoring**: Personalized learning paths

---

This module provides a solid foundation for building sophisticated conversational AI applications with rich audio capabilities and comprehensive user interaction features.
