# Voice Components - Refactored Structure

This directory contains the refactored voice assistant components, broken down into smaller, more focused components for better maintainability and readability.

## Component Structure

### Core Components

- **`VoiceAssistant.tsx`** - Main orchestrator component that handles different states
- **`VoiceAssistantPanel.tsx`** - Higher-level wrapper component

### UI Components

- **`ChatInput.tsx`** - Reusable chat input with variants (default/compact)
- **`ChatEntry.tsx`** - Chat message display with variants (default/compact)
- **`ChatEmptyState.tsx`** - Empty state display for chat area
- **`ControlBar.tsx`** - Voice control bar with chat toggle functionality
- **`PhoneCallScreen.tsx`** - Incoming call simulation screen
- **`ConnectingState.tsx`** - Loading state during connection

### Audio/Visual Components

- **`AgentTile.tsx`** - Voice visualizer for the AI agent
- **`ChatMessageView.tsx`** - Chat messages container
- **`SphereVisualizer.tsx`** - 3D sphere visualization
- **`PhoneChatPanel.tsx`** - Phone-style chat interface

## Key Improvements

### 1. **Reduced Complexity**

- Original `VoiceAssistant.tsx` was 726 lines
- Refactored into 8 focused components (~100 lines each)
- Each component has a single responsibility

### 2. **Better Reusability**

- Components support variants (default/compact)
- Shared styling patterns through variant system
- Utility functions for common operations

### 3. **Improved Type Safety**

- Proper TypeScript interfaces for all props
- Centralized type definitions in `types/index.ts`
- Type validation for message content

### 4. **Enhanced Maintainability**

- Consistent naming conventions
- Modular architecture
- Clean separation of concerns
- Utility functions for common logic

### 5. **Better Performance**

- Reduced re-renders through component separation
- Optimized animations and state management
- Removed excessive debugging code

## Usage Examples

```tsx
// Basic usage
<VoiceAssistant
  selectedTopic={topic}
  onStartCall={() => console.log('Call started')}
  onDeclineCall={() => console.log('Call declined')}
  isConnected={false}
/>

// Full-screen mode
<VoiceAssistant
  selectedTopic={topic}
  isConnected={true}
  isFullScreenMode={true}
/>
```

## Component Variants

### ChatInput Variants

- `default` - Large input for desktop
- `compact` - Smaller input for mobile/full-screen

### ChatEntry Variants

- `default` - Large message bubbles
- `compact` - Smaller message display

### ControlBar Variants

- `default` - Full-featured control bar
- `compact` - Minimal control bar for space-constrained layouts

## Utility Functions

Located in `utils/index.ts`:

- `formatMessageTime()` - Format timestamps
- `isUserMessage()` - Check message sender
- `getSenderDisplayName()` - Get display name
- `validateMessage()` - Validate message content
- `generateMessageId()` - Generate unique IDs

## File Organization

```
voice/
├── README.md                 # This file
├── index.ts                 # Barrel exports
├── VoiceAssistant.tsx       # Main component
├── VoiceAssistantPanel.tsx  # Panel wrapper
├── ChatInput.tsx            # Input component
├── ChatEntry.tsx            # Message component
├── ChatEmptyState.tsx       # Empty state
├── ControlBar.tsx           # Control bar
├── PhoneCallScreen.tsx      # Call screen
├── ConnectingState.tsx      # Loading state
├── AgentTile.tsx           # Voice visualizer
├── ChatMessageView.tsx     # Message container
├── SphereVisualizer.tsx    # 3D visualization
└── PhoneChatPanel.tsx      # Phone interface
```

This refactored structure follows Next.js 15 best practices and makes the codebase much more maintainable and easier to understand.
