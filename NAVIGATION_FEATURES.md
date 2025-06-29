# Test Navigation Features 🎯

This document outlines the comprehensive test navigation system built with Zustand state management for the AI English Tutor application.

## 🚀 Features Overview

### ✅ Question Navigation Grid

- **Visual Grid Layout**: Questions displayed in a responsive grid (5-10 columns based on screen size)
- **Status Indicators**:
  - 🟢 **Green**: Answered questions
  - ⚪ **Gray**: Unanswered questions
  - 🟡 **Yellow**: Reviewed but not answered
  - 🔵 **Blue**: Current question
- **Visual Icons**: ✅ (answered), 👁️ (current), 👀 (reviewed)
- **Hover Effects**: Scale animation and tooltips
- **Quick Navigation**: Click any question number to jump directly

### ✅ Answer Tracking System

- **Real-time Updates**: Answer count updates immediately when answers are selected
- **Persistent State**: Answers maintained when navigating between questions
- **Progress Calculation**: Dynamic percentage calculation
- **Visual Feedback**: Immediate visual confirmation of answer selection

### ✅ Current Question Highlighting

- **Active Indicator**: Current question highlighted with blue background
- **Ring Animation**: Focus ring for better visibility
- **Auto-scroll**: Navigation panel scrolls to show current question
- **Breadcrumb**: Current question number displayed in header

### ✅ Jump to Specific Questions

- **Direct Navigation**: Click any question number in the grid
- **Quick Actions**:
  - "First Unanswered" - Jump to first question without an answer
  - "Last Unanswered" - Jump to last question without an answer
  - "Go to Start" - Jump to question 1
  - "Go to End" - Jump to last question
- **Smart Navigation**: Find next/previous unanswered questions

### ✅ Submit Button & Test Completion

- **Smart Submit Button**:
  - 🟢 Green when all questions answered
  - 🟠 Orange when incomplete (shows count)
- **Confirmation Modal**: Detailed submission confirmation with:
  - Test summary statistics
  - Warning for unanswered questions
  - Progress visualization
  - Force submit option for incomplete tests
- **Loading States**: Animated submission with progress indicator

## 🏗️ Architecture

### Zustand Store (`useTestNavigationStore`)

```typescript
interface TestNavigationState {
  // Core test data
  testId: string | null;
  testType: PracticeType | null;
  questions: QuizModel[];
  currentQuestionIndex: number;
  selectedAnswers: Record<number, number>;

  // Navigation state
  isNavigationPanelOpen: boolean;
  reviewedQuestions: Set<number>;

  // Submission state
  isReadyToSubmit: boolean;
  showSubmitConfirmation: boolean;
  isSubmitting: boolean;

  // UI state
  showQuestionPalette: boolean;
}
```

### Key Actions

- `initializeTest()` - Setup test with questions
- `setCurrentQuestion()` - Navigate to specific question
- `setAnswer()` - Record answer for question
- `markQuestionAsReviewed()` - Track reviewed questions
- `submitTest()` - Handle test submission
- `getQuestionStatus()` - Get comprehensive question status

### Computed Values

- `getAnsweredCount()` - Count of answered questions
- `getUnansweredCount()` - Count of remaining questions
- `getProgressPercentage()` - Completion percentage
- `canSubmitTest()` - Whether all questions are answered
- `getNextUnansweredQuestion()` - Find next question to answer

## 🎨 Components

### 1. `QuestionNavigationGrid`

**Purpose**: Visual grid showing all questions with status indicators

**Features**:

- Responsive grid layout (5-10 columns)
- Color-coded status indicators
- Hover animations and tooltips
- Quick navigation buttons
- Legend showing status meanings

**Props**:

```typescript
interface QuestionNavigationGridProps {
  onQuestionSelect?: (questionIndex: number) => void;
  className?: string;
}
```

### 2. `TestNavigationPanel`

**Purpose**: Slide-out panel with navigation controls and submission

**Features**:

- Fixed position toggle button
- Slide-in/out animation
- Progress summary with visual bar
- Navigation controls (prev/next unanswered)
- Question grid integration
- Submit button with status
- Quick statistics cards

**Props**:

```typescript
interface TestNavigationPanelProps {
  onQuestionChange?: (questionIndex: number) => void;
  className?: string;
}
```

### 3. `TestSubmissionModal`

**Purpose**: Confirmation modal for test submission

**Features**:

- Test summary statistics
- Progress visualization
- Warning for incomplete tests
- Loading states during submission
- Force submit option
- Responsive design

**Props**:

```typescript
interface TestSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  className?: string;
}
```

### 4. `TestNavigationDemo`

**Purpose**: Interactive demo showcasing all features

**Features**:

- Sample test data generation
- Interactive controls
- Real-time statistics
- Demo actions (random answers, navigation)
- Visual examples of all states

## 🔧 Integration

### With Existing TestContainer

The navigation system integrates seamlessly with the existing `TestContainer`:

```typescript
// Sync navigation store with test session
useEffect(() => {
  if (state.questions.length > 0 && !state.loading) {
    initNavigationTest(testId, testType, state.questions);
  }
}, [state.questions, state.loading, testId, testType, initNavigationTest]);

// Handle dual store updates
const handleAnswerSelected = (answerIndex: number) => {
  actions.setAnswer(answerIndex);
  setNavigationAnswer(state.currentPosition, answerIndex);
};
```

### State Synchronization

The system maintains consistency between:

- `useTestSession` hook (main test logic)
- `useTestNavigationStore` (navigation features)
- Component local state (UI interactions)

## 🎮 Usage Examples

### Basic Integration

```typescript
import { TestNavigationPanel } from "@/modules/practice/components/test";

function MyTestComponent() {
  const handleQuestionChange = (index: number) => {
    console.log(`Navigated to question ${index + 1}`);
  };

  return (
    <div>
      {/* Your test content */}
      <TestNavigationPanel onQuestionChange={handleQuestionChange} />
    </div>
  );
}
```

### Custom Navigation Grid

```typescript
import { QuestionNavigationGrid } from "@/modules/practice/components/test";

function CustomNavigator() {
  return (
    <QuestionNavigationGrid
      onQuestionSelect={(index) => alert(`Question ${index + 1}`)}
      className="my-custom-styles"
    />
  );
}
```

### Demo Page

Visit `/test-navigation-demo` to see all features in action with:

- 40 sample questions
- Interactive controls
- Real-time statistics
- All navigation features

## 🎯 Benefits

1. **Enhanced UX**: Students can easily navigate between questions
2. **Progress Tracking**: Clear visual indication of completion status
3. **Efficient Review**: Quick access to unanswered questions
4. **Reduced Errors**: Confirmation before submission
5. **Responsive Design**: Works on all device sizes
6. **Performance**: Optimized with Zustand for fast updates
7. **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Demo

To see the navigation features in action:

1. Start the development server: `npm run dev`
2. Visit: `http://localhost:3000/test-navigation-demo`
3. Interact with:
   - Question grid navigation
   - Answer selection
   - Progress tracking
   - Submission flow

## 🔮 Future Enhancements

- **Bookmarking**: Mark questions for later review
- **Time Tracking**: Per-question time spent
- **Analytics**: Navigation patterns and insights
- **Keyboard Shortcuts**: Quick navigation hotkeys
- **Mobile Gestures**: Swipe navigation on mobile
- **Auto-save**: Periodic answer saving
- **Offline Mode**: Continue test without internet

---

Built with ❤️ using Next.js 15, TypeScript, Tailwind CSS, and Zustand
