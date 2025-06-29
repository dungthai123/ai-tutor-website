# AI Tutor Module

This module contains the AI English tutor functionality with a clean, modular architecture.

## 📁 Structure

```
src/modules/aitutor/
├── components/          # React components
│   ├── TopicSelector.tsx       # Main topic selector component
│   ├── CategoryGrid.tsx        # Category selection grid
│   ├── TopicGrid.tsx          # Topic selection grid
│   ├── TopicCard.tsx          # Individual topic card
│   ├── TopicSelectorHeader.tsx # Header section
│   ├── LoadingSpinner.tsx      # Reusable loading component
│   ├── ErrorMessage.tsx        # Error display component
│   ├── VoiceAssistantPanel.tsx # Main voice assistant panel
│   ├── EmptyState.tsx         # Empty/error state component
│   ├── ConnectingState.tsx    # Connecting state component
│   ├── ConnectedSession.tsx   # Connected session with LiveKit
│   ├── SessionHeader.tsx      # Session header with controls
│   └── index.ts               # Component exports
├── hooks/              # Custom React hooks
│   ├── useTopicSelector.ts    # Topic selector state management
│   ├── useVoiceAssistantPanel.ts # Voice assistant panel state
│   └── index.ts              # Hook exports
├── services/           # API services
│   └── index.ts              # TopicService for API calls
├── types/              # TypeScript type definitions
│   └── index.ts              # All module types
├── utils/              # Utility functions
│   └── index.ts              # Helper functions
└── README.md           # This file
```

## 🧩 Components

### TopicSelector

Main component that orchestrates the topic selection flow.

**Props:**

- `onTopicSelect`: Callback when a topic is selected
- `selectedCategoryId?`: Pre-selected category ID
- `selectedTopicId?`: Pre-selected topic ID

### VoiceAssistantPanel

Main component that manages the voice assistant interface with different states.

**Props:**

- `selectedTopic`: Currently selected topic
- `userName`: User's name
- `token`: LiveKit connection token
- `isConnecting`: Whether currently connecting
- `onStartCall`: Callback to start voice call
- `onDeclineCall`: Callback to decline call
- `onDisconnect`: Callback to disconnect session
- `onToggleFullScreen`: Callback to toggle full screen

**States:**

- `empty`: No topic selected
- `connecting`: Connecting to LiveKit
- `connected`: Active session with LiveKit
- `disconnected`: Topic selected but not connected
- `error`: Error state

### CategoryGrid

Displays categories in a responsive grid layout.

### TopicGrid

Displays topics for the selected category.

### TopicCard

Individual topic card with image, title, and description.

### EmptyState

Reusable component for empty states, error states, and informational displays.

### ConnectingState

Component shown during the connection process.

### ConnectedSession

Component that wraps the LiveKit room and voice assistant when connected.

### SessionHeader

Header component with session info and control buttons.

### LoadingSpinner

Reusable loading spinner with customizable size and message.

### ErrorMessage

Error display component with optional retry functionality.

## 🎣 Hooks

### useTopicSelector

Custom hook that manages:

- Categories and topics state
- Loading states
- Error handling
- Auto-selection logic
- API calls

**Usage:**

```typescript
const {
  categories,
  topics,
  selectedCategory,
  selectedTopic,
  loading,
  error,
  handleCategorySelect,
  handleTopicSelect,
  resetSelection,
} = useTopicSelector(selectedCategoryId, selectedTopicId);
```

### useVoiceAssistantPanel

Custom hook that manages:

- Voice assistant panel state
- State type determination
- Empty state configuration
- Connection status

**Usage:**

```typescript
const { stateType, emptyStateConfig, isConnected } = useVoiceAssistantPanel(
  selectedTopic,
  token,
  isConnecting
);
```

## 🔧 Services

### TopicService

Static class for API operations:

- `fetchCategories()`: Get all categories with fallback
- `fetchTopics(categoryId)`: Get topics for a category with fallback

Features:

- Automatic fallback to external API
- Consistent error handling
- Detailed logging

## 📝 Types

### Core Types

- `Category`: Category data structure
- `Topic`: Topic data structure
- `TopicSelectorProps`: Component props interface
- `TopicSelectorState`: Hook state interface
- `VoiceAssistantPanelProps`: Voice assistant panel props
- `VoiceAssistantPanelState`: Voice assistant panel state
- `SessionHeaderProps`: Session header props
- `EmptyStateProps`: Empty state props

## 🛠 Utils

### Helper Functions

- `getImageUrl(imageUrl)`: Format image URLs correctly
- `handleImageError(topicTitle)`: Log image loading errors
- `formatCategoryCount(count)`: Format category count display
- `generateRoomKey(token, topicId)`: Generate unique LiveKit room keys
- `getLiveKitServerUrl()`: Get LiveKit server URL
- `isSessionConnected(token, topic, connecting)`: Check connection status

## 🔄 Data Flow

### Topic Selection Flow

1. **Initialization**: `useTopicSelector` hook loads categories
2. **Category Selection**: User selects category → hook loads topics
3. **Topic Selection**: User selects topic → callback fired with topic data
4. **Auto-selection**: Hook handles pre-selection of category/topic if provided

### Voice Assistant Flow

1. **Empty State**: No topic selected → show welcome message
2. **Topic Selected**: Show voice assistant call interface
3. **Connecting**: Show connecting spinner
4. **Connected**: Show LiveKit room with voice assistant
5. **Error**: Show error state with retry option

## 🎯 Benefits of Refactoring

### ✅ Modularity

- Each component has a single responsibility
- Easy to test individual components
- Reusable components across the app
- Clear separation between UI states

### ✅ Maintainability

- Clear separation of concerns
- Centralized state management with hooks
- Consistent error handling
- Predictable state transitions

### ✅ Type Safety

- Comprehensive TypeScript interfaces
- Proper type checking throughout
- Strongly typed state management

### ✅ Performance

- Efficient state updates
- Memoization opportunities
- Reduced re-renders
- Optimized component mounting

### ✅ Developer Experience

- Clear file structure
- Comprehensive documentation
- Easy to extend and modify
- Predictable component behavior

## 🚀 Usage Examples

### Basic TopicSelector Usage

```typescript
import { TopicSelector } from "@/modules/aitutor/components";

function MyComponent() {
  const handleTopicSelect = (categoryId, topicId, topicData) => {
    console.log("Selected topic:", topicData);
  };

  return (
    <TopicSelector
      onTopicSelect={handleTopicSelect}
      selectedCategoryId={1}
      selectedTopicId="topic-123"
    />
  );
}
```

### VoiceAssistantPanel Usage

```typescript
import { VoiceAssistantPanel } from "@/modules/aitutor/components";

function VoiceInterface() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [token, setToken] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <VoiceAssistantPanel
      selectedTopic={selectedTopic}
      userName="Student"
      token={token}
      isConnecting={isConnecting}
      onStartCall={() => {
        /* start call logic */
      }}
      onDeclineCall={() => {
        /* decline call logic */
      }}
      onDisconnect={() => {
        /* disconnect logic */
      }}
      onToggleFullScreen={() => {
        /* toggle full screen */
      }}
    />
  );
}
```

## 🔮 Future Enhancements

- Add caching for API responses
- Implement virtual scrolling for large lists
- Add search/filter functionality
- Add unit tests for all components
- Add Storybook stories for component documentation
- Add voice assistant analytics
- Implement session recording
