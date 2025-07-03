# Practice Module Store Architecture

This directory contains the refactored state management for the practice module, breaking down the large monolithic store into smaller, focused stores.

## Store Structure

### Individual Stores

#### 1. `timerStore.ts` - Timer Management

Handles all timer-related state and actions:

- `currentTime` - elapsed time in seconds
- `totalTime` - total allowed time based on HSK level
- `isTimerRunning` - timer status
- Actions: `startTimer()`, `pauseTimer()`, `updateTimer()`, `resetTimer()`

```typescript
import { useTimerStore } from "@/modules/practice/stores";

function TimerComponent() {
  const { currentTime, totalTime, startTimer, pauseTimer } = useTimerStore();
  // ...
}
```

#### 2. `navigationStore.ts` - Question Navigation

Manages question navigation and answer tracking:

- `currentPosition` - current question index
- `selectedAnswers` - mapping of question index to selected answer
- `quizList` - array of quiz questions
- `reviewedQuestions` - set of reviewed question indices
- Actions: `nextQuestion()`, `previousQuestion()`, `goToQuestion()`, `setAnswer()`

```typescript
import { useNavigationStore } from "@/modules/practice/stores";

function NavigationComponent() {
  const { currentPosition, getCurrentQuestion, nextQuestion, canGoNext } =
    useNavigationStore();
  // ...
}
```

#### 3. `uiStateStore.ts` - UI State Management

Handles UI toggles and display states:

- Content toggles: `isShowTranslation`, `isShowExplanation`, `isShowTranscript`
- Answer state: `isAnswerSelected`, `isAnswerCorrect`, `isShowAnswerFeedback`
- UI settings: `fontSize`
- Loading states: `isLoading`, `isCompleted`

```typescript
import { useUIStateStore } from "@/modules/practice/stores";

function UIControlsComponent() {
  const { isShowTranslation, toggleTranslation, fontSize, setFontSize } =
    useUIStateStore();
  // ...
}
```

#### 4. `submissionStore.ts` - Score & Submission

Manages scoring, history, and test submission:

- Score tracking: `right`, `wrong`, `skip`, `score`
- History: `historyMap` - detailed answer history
- Submission: `isSubmitting`, `showSubmitConfirmation`, `isReadyToSubmit`

```typescript
import { useSubmissionStore } from "@/modules/practice/stores";

function ScoreComponent() {
  const { right, wrong, skip, calculateScore, submitTest } =
    useSubmissionStore();
  // ...
}
```

### Coordination Layer

#### `useTestSessionSync.ts` - Store Coordination

A utility hook that coordinates between individual stores for complex operations:

```typescript
import { useTestSessionSync } from '@/modules/practice/stores';

function TestComponent({ testId, testType, topicModel, quizList }) {
  const testSync = useTestSessionSync({
    testId,
    testType,
    topicModel,
    quizList,
    showAnswerAfterEach: true
  });

  const handleAnswer = (answerIndex) => {
    testSync.actions.setAnswer(answerIndex);
  };

  const handleNext = () => {
    testSync.actions.nextQuestion();
  };

  // Access individual stores if needed
  const timerState = testSync.stores.timer;
  const navState = testSync.stores.navigation;

  // Get computed values that span stores
  const canSubmit = testSync.computed.canSubmitTest();
  const progress = testSync.computed.getTestProgress();

  return (
    // Component JSX
  );
}
```

### Backward Compatibility

#### Option 1: Original Store (Recommended for existing code)

The original `useTestSessionStoreForReadingAndListening` is maintained for backward compatibility and now internally uses the new modular stores via `useTestSessionSync`. Existing components can continue using it without changes:

```typescript
// This still works exactly the same as before
import { useTestSessionStoreForReadingAndListening } from "@/lib/stores/testSessionStoreForReadingAndListening";

function ExistingComponent() {
  const testSession = useTestSessionStoreForReadingAndListening();
  // All existing code works unchanged
}
```

#### Option 2: New Wrapper Hook

For new code or gradual migration, you can use `useTestSessionSync` which provides the same interface but with more flexibility:

```typescript
import { useTestSessionSync } from "@/modules/practice/stores";

function NewComponent() {
  const testSession = useTestSessionSync();
  // Same interface as the original store
}
```

## Usage Patterns

### 1. Simple UI Component (Single Store)

For components that only need one aspect of state:

```typescript
// Timer display component
import { useTimerStore } from "@/modules/practice/stores";

function TimerDisplay() {
  const { currentTime, totalTime } = useTimerStore();
  return (
    <div>
      {currentTime} / {totalTime}
    </div>
  );
}
```

### 2. Complex Component (Multiple Stores)

For components that need multiple aspects of state:

```typescript
// Question component that needs navigation + UI state
import { useNavigationStore, useUIStateStore } from "@/modules/practice/stores";

function QuestionComponent() {
  const { getCurrentQuestion } = useNavigationStore();
  const { fontSize, isShowTranslation } = useUIStateStore();

  const question = getCurrentQuestion();
  // ...
}
```

### 3. Coordinated Actions (Test Session Sync)

For components that need to perform actions that affect multiple stores:

```typescript
// Main test container
import { useTestSessionSync } from '@/modules/practice/stores';

function TestContainer({ testData }) {
  const testSync = useTestSessionSync(testData);

  // These actions coordinate between multiple stores
  const handleAnswer = testSync.actions.setAnswer;
  const handleNext = testSync.actions.nextQuestion;

  return (
    // Component that orchestrates the entire test
  );
}
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each store has a single responsibility
2. **Improved Performance**: Components only re-render when relevant state changes
3. **Better Testability**: Individual stores can be tested in isolation
4. **Enhanced Maintainability**: Changes to timer logic don't affect navigation logic
5. **Reusability**: Stores can be used independently in different contexts
6. **Type Safety**: Better TypeScript support with focused interfaces

## Migration Guide

### From Original Store

If you're migrating from the original large store:

```typescript
// Before
import { useTestSessionStoreForReadingAndListening } from "@/lib/stores/testSessionStoreForReadingAndListening";

// After (option 1 - keep using original for backward compatibility)
import { useTestSessionStoreForReadingAndListening } from "@/lib/stores/testSessionStoreForReadingAndListening";

// After (option 2 - use individual stores)
import { useTimerStore, useNavigationStore } from "@/modules/practice/stores";

// After (option 3 - use coordination hook)
import { useTestSessionSync } from "@/modules/practice/stores";
```

### Recommended Migration Strategy

1. Keep existing components using the original store
2. New components should use individual stores or the sync hook
3. Gradually migrate components one by one when making other changes
4. Use the sync hook for components that need coordinated actions

## Utility Functions

The `utils/testUtils.ts` file contains pure functions for common calculations:

- `getTimerDuration(level)` - Get timer duration for HSK level
- `calculateTestScore(questions, answers)` - Calculate test score
- `formatTime(seconds)` - Format time display
- `isAnswerCorrect(answerIndex, correctAnswer)` - Check answer correctness
- `findNextUnansweredQuestion()` - Navigation helpers

These can be used independently of the stores for calculations or testing.
