# AI Chatbot Setup Guide

## Overview

The AI Chatbot is a floating assistant that helps users with English learning, HSK preparation, grammar, and vocabulary questions using OpenAI's GPT-4o model.

## Features

- 🤖 **AI-Powered**: Uses OpenAI GPT-4o for intelligent responses
- 💬 **Floating UI**: Non-intrusive floating button with expandable chat window
- 🌙 **Dark Mode**: Matches your application's dark theme
- 📱 **Responsive**: Works on desktop and mobile devices
- 💾 **State Management**: Uses Zustand for efficient state management
- ⚡ **Real-time**: Instant responses with beautiful loading indicators
- 🛡️ **Duplicate Prevention**: Triple-layer protection against message duplication
- 🎨 **Clean Code**: Well-organized, maintainable component architecture

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Get your API key from:** https://platform.openai.com/api-keys

### 2. Dependencies

The following packages are already installed:

- `openai` - OpenAI SDK for API communication
- `zustand` - State management library

### 3. Module Structure

```
src/modules/chatbot/
├── components/
│   ├── FloatingChatButton.tsx    # Floating action button
│   ├── ChatWindow.tsx            # Main chat interface
│   ├── ChatMessage.tsx           # Individual message component
│   ├── ChatInput.tsx             # Message input with send functionality
│   └── index.ts                  # Component exports
├── hooks/
│   ├── useChat.ts                # Chat logic and API communication
│   └── index.ts                  # Hook exports
├── stores/
│   ├── useChatStore.ts           # Zustand store for chat state
│   └── index.ts                  # Store exports
├── types/
│   └── index.ts                  # TypeScript interfaces
└── index.ts                      # Main module exports
```

### 4. API Route

The chatbot uses a Next.js API route at `/api/chat` that:

- Accepts POST requests with user messages
- Maintains conversation context (last 10 messages)
- Returns AI responses from GPT-4o
- Includes proper error handling

## Usage

### Basic Integration

The chatbot is automatically integrated into your application through the root layout. It appears as a floating button in the bottom-right corner of all pages.

### Customization

You can customize the chatbot behavior by modifying:

1. **System Prompt** (in `/api/chat/route.ts`):

   ```typescript
   content: `You are a helpful AI assistant for an English learning platform...`;
   ```

2. **UI Theme** (in component files):

   - Colors, spacing, and styling using Tailwind CSS
   - Dark mode support through CSS classes

3. **Conversation Limits**:
   - Message history limit (currently 10 messages)
   - Token limits for API requests

## Components Overview

### FloatingChatButton

- Fixed position floating button
- Toggles between chat and close icons
- Smooth hover animations and accessibility features

### ChatWindow

- Expandable chat interface (396px × 500px)
- Header with AI avatar and status
- Scrollable message area
- Input area with send functionality

### ChatMessage

- Displays user and assistant messages
- Different styling for each role
- Timestamps and responsive design

### ChatInput

- Auto-resizing textarea
- Send button with loading states
- Enter key support (Shift+Enter for new lines)

## State Management

The chatbot uses Zustand for state management with the following store:

```typescript
interface ChatStore {
  isOpen: boolean; // Chat window visibility
  messages: ChatMessage[]; // Conversation history
  isLoading: boolean; // API request status
  error: string | null; // Error messages
  // Actions...
}
```

## API Configuration

The OpenAI API is configured with:

- **Model**: GPT-4o
- **Max Tokens**: 500 per response
- **Temperature**: 0.7 (balanced creativity)
- **Context**: Last 10 messages for conversation continuity

## Error Handling

The chatbot includes comprehensive error handling:

- Network errors
- API key validation
- Rate limiting
- Invalid responses
- User-friendly error messages

## Security Considerations

- API key is stored server-side only
- No sensitive user data is logged
- Conversation history is client-side only
- Rate limiting through OpenAI's built-in limits

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**

   - Ensure `.env.local` contains `OPENAI_API_KEY`
   - Restart your development server

2. **Chat button not appearing**

   - Check if components are imported in `layout.tsx`
   - Verify z-index conflicts with other elements

3. **Messages not sending**
   - Check browser console for errors
   - Verify API route is accessible at `/api/chat`
   - Check OpenAI API key validity

### Development Tips

1. **Testing**: Use the browser's developer tools to inspect network requests
2. **Styling**: Modify Tailwind classes in component files
3. **Debugging**: Check console logs in both browser and server
4. **State**: Use browser dev tools to inspect Zustand store state

## Future Enhancements

Potential improvements:

- Voice input/output
- File upload support
- Conversation persistence
- Multi-language support
- Custom AI personalities
- Integration with learning progress
