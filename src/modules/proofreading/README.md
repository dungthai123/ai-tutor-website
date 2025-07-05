# Proofreading Module

A comprehensive AI-powered proofreading tool built with Next.js, TipTap, and OpenAI.

## Features

- **Rich Text Editor**: TipTap-based editor with character count and customizable styling
- **AI-Powered Corrections**: OpenAI integration for grammar, spelling, and style corrections
- **Interactive Highlights**: Click on highlighted corrections to see detailed explanations
- **Smart Suggestions**: Alternative phrasing suggestions for improved writing
- **Copy & Edit Controls**: Easy text manipulation with copy, edit, and reset functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Architecture

### Components

- `GrammarEditor`: Main rich-text editor component using TipTap
- `EditorActions`: Action buttons for proofreading, copying, and editing
- `TextSuggestion`: Displays AI-generated alternative suggestions
- `CorrectionTooltip`: Interactive tooltips showing correction details

### Hooks

- `useProofreader`: Main hook for managing proofreading state and API calls

### Services

- Uses the shared `OpenAIService` with a specialized `PROOFREADER` configuration

### Types

- `EditModel`: Represents a single correction with old text, new text, and reason
- `AssistantResult`: Complete proofreading result with correction, suggestion, and edits

## Usage

```tsx
import {
  GrammarEditor,
  EditorActions,
  TextSuggestion,
} from "@/modules/proofreading/components";
import { useProofreader } from "@/modules/proofreading/hooks";

function MyProofreadingTool() {
  const { result, loading, error, proofread } = useProofreader();

  return (
    <div>
      <GrammarEditor onUpdate={handleUpdate} />
      <EditorActions onProofread={() => proofread(text)} />
      {result?.suggestion && <TextSuggestion suggestion={result.suggestion} />}
    </div>
  );
}
```

## API

### POST /api/proofread

Accepts text and returns structured corrections and suggestions.

**Request:**

```json
{
  "text": "Your text to proofread"
}
```

**Response:**

```json
{
  "correction": "Corrected text",
  "suggestion": "Alternative suggestion (optional)",
  "edits": [
    {
      "oldText": "wrong phrase",
      "newText": "correct phrase",
      "reasons": { "en": "Explanation of the correction" }
    }
  ]
}
```

## Styling

The module uses Tailwind CSS with custom classes for:

- `.correction-highlight`: Styling for highlighted corrections
- `.prose-editor-content`: TipTap editor container styling
- Custom Tippy.js tooltip themes

## Future Enhancements

- [ ] Support for multiple languages
- [ ] Writing style analysis (formal/informal)
- [ ] Plagiarism detection
- [ ] Document history and version control
- [ ] Export to various formats (PDF, Word, etc.)
- [ ] Real-time collaborative editing
