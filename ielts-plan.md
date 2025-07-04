# IELTS Practice Module - Implementation Plan (Revised)

## 1. Overview

This document outlines a detailed plan for building a new **IELTS Practice** module. This module will provide students with a comprehensive practice platform for all four sections of the IELTS exam: Listening, Reading, Writing, and Speaking.

The module will be built as a new, self-contained feature within the existing project, following the established modular architecture. It will be located in `src/modules/ieltspractice` to keep it separate from the existing HSK practice module.

---

## 2. Architecture & Module Structure

We will create a new feature module `ieltspractice` to encapsulate all related logic, components, and services.

### Page Routing (App Router)

- **Main Practice Page**: `src/app/ielts-practice/page.tsx`
  - Displays the skill selector and a list of available IELTS tests.
- **Test Detail Page**: `src/app/ielts-practice/test/[testId]/page.tsx`
  - The main container for taking a specific IELTS test, with navigation between the four skills.

### Module Directory Structure

src/modules/ieltspractice/
├── components/
│ ├── main/
│ │ ├── SkillSelector.tsx
│ │ ├── IeltsTestCard.tsx
│ │ └── IeltsTestList.tsx
│ ├── test/
│ │ ├── IeltsTestContainer.tsx
│ │ ├── TestHeader.tsx
│ │ ├── SkillTabs.tsx
│ │ └── sections/
│ │ ├── ListeningSection.tsx
│ │ ├── ReadingSection.tsx
│ │ ├── WritingSection.tsx
│ │ └── SpeakingSection.tsx
│ ├── questions/
│ │ ├── MultipleChoiceQuestion.tsx
│ │ ├── ShortAnswerQuestion.tsx
│ │ ├── FillInTheBlankQuestion.tsx
│ │ ├── CheckboxQuestion.tsx
│ │ └── ... (other question type components)
│ └── shared/
│ ├── AudioPlayer.tsx
│ ├── RichTextEditor.tsx
│ └── VoiceRecorder.tsx
├── hooks/
│ ├── useIeltsPracticePage.ts
│ └── useIeltsTestSession.ts
├── services/
│ ├── ielts-data.service.ts
│ └── ielts-test.service.ts
├── types/
│ └── index.ts
└── README.md

---

## 3. Data Management & Modeling

### Data Source

- **Listening**: `public/listening-json/`
- **Reading**: `public/reading-json/`
- **Writing**: `public/writing-json/`
- **Speaking**: `public/speaking-json/`

### Data Loading Strategy

- The main page (`/ielts-practice`) will fetch a list of all available tests by scanning the `public` directories in `ielts-data.service.ts`. This will be done on the server.
- The test detail page (`/ielts-practice/test/[testId]`) will dynamically load the specific JSON files for the requested `testId`.
- **HTML Parsing**: The `ielts-data.service.ts` must include logic to handle the `full_html` fields within the JSON data. This content should be parsed and sanitized using a library like `DOMPurify` before being rendered to prevent XSS vulnerabilities and ensure correct display.
- **Data Validation**: The service will implement robust validation to check for the presence of required fields (e.g., `parts`, `questions`, `type`) and handle the nested structures gracefully, mapping them to the TypeScript interfaces.

### TypeScript Interfaces (`/types/index.ts`)

These interfaces are refined to more closely match the provided JSON structure.

```typescript
// /src/modules/ieltspractice/types/index.ts

export enum IeltsSkill {
  LISTENING = "listening",
  READING = "reading",
  WRITING = "writing",
  SPEAKING = "speaking",
}

// Base question fields
export interface IeltsQuestionBase {
  number: string; // e.g., "1", "8-10"
  type: string; // e.g., "6", "9", "checkbox"
  title: string;
}

// For multiple choice or checkbox questions
export interface IeltsChoiceQuestion extends IeltsQuestionBase {
  options: Array<{ option: string; text: string }>;
}

// For fill-in-the-blank or short answer
export interface IeltsInputQuestion extends IeltsQuestionBase {
  context: string; // The surrounding text for the blank
}

export type IeltsQuestion = IeltsChoiceQuestion | IeltsInputQuestion;

// A group of questions, often with shared context
export interface IeltsQuestionGroup {
  title: string;
  listen_time: string | null;
  description: string; // Can contain HTML
  questions: IeltsQuestion[];
  context?: {
    full_html: string;
    table?: any; // Define table structure if needed
    instructions?: string[];
  };
}

// A Part of a Listening or Reading test
export interface IeltsSkillTestPart {
  part_number: number;
  title: string;
  question_groups: IeltsQuestionGroup[];
}

// For a Writing Task
export interface IeltsWritingTask {
  task_number: number;
  title: string;
  content: {
    full_html: string;
    text_content: Array<{ text: string; html: string }>;
  };
  images: Array<{ alt: string; src: string }>;
}

// For a Speaking Part
export interface IeltsSpeakingPart {
  part_number: string;
  title: string;
  questions: Array<{ question_number: number; text: string; html: string }>;
}

// The complete, typed structure for a single IELTS test
export interface IeltsTest {
  id: string; // Inferred from filename, e.g., "2021_april_1"
  test_title: string;
  listening: {
    parts: IeltsSkillTestPart[];
    audio: { direct_url?: string; sources: any[] };
  };
  reading: {
    parts: IeltsSkillTestPart[];
  };
  writing: {
    tasks: IeltsWritingTask[];
  };
  speaking: {
    parts: IeltsSpeakingPart[];
  };
}
```

---

## 4. Test Detail Page Implementation

### Question Component Mapping

To handle the variety of questions, we will create a mapping between the `type` field in the JSON and the corresponding React components. A renderer component will use this mapping to dynamically render the correct component for each question.

| JSON `type`  | React Component              | Description                                                      |
| :----------- | :--------------------------- | :--------------------------------------------------------------- |
| `"6"`        | `MultipleChoiceQuestion.tsx` | Renders a question with A, B, C, D radio buttons.                |
| `"8"`        | `ShortAnswerQuestion.tsx`    | Renders a single text input for a short answer.                  |
| `"9"`        | `FillInTheBlankQuestion.tsx` | Renders a text input, often embedded within a sentence or table. |
| `"checkbox"` | `CheckboxQuestion.tsx`       | Renders a question where multiple options can be selected.       |

### Skill-Specific Implementations

#### A. Listening (`ListeningSection.tsx`)

- **`AudioPlayer.tsx`**: A robust, reusable audio player with play/pause, progress bar, and volume controls. Playback should only be possible a limited number of times as per IELTS rules.
- **Multiple Audio Sources**: The player component must be able to handle the `audio.sources` array from the JSON. It should try the primary source first and have a fallback mechanism to try other sources if the primary one fails to load.
- **Question Display**: Questions are rendered below the player. The UI will use the `listen_time` markers to scroll to or highlight the relevant questions as the audio progresses.

#### B. Reading (`ReadingSection.tsx`)

- **Split Layout**: A two-panel view with the scrollable passage on the left and questions on the right.
- **Passage Rendering**: The component will parse and render the passage content from the `context.full_html` field.

#### C. Writing (`WritingSection.tsx`)

- **Task Viewer**: Clearly displays the prompt, including images from the `images` array in the JSON.
- **`RichTextEditor.tsx`**: A simple text editor for users to type their answers, with a real-time word count.

#### D. Speaking (`SpeakingSection.tsx`)

- **Sequential Prompt Display**: Shows the questions for each part sequentially.
- **`VoiceRecorder.tsx`**: A component to handle audio recording.
- **Timers**: Separate timers for preparation and response time.

---

## 5. Development Phases

This implementation will be broken down into manageable phases.

#### Phase 1: Core Structure & Data Foundation (3-5 days)

1.  **Goal**: Set up the module structure and a robust data layer.
2.  **Tasks**:
    - Create the `src/modules/ieltspractice` directory structure.
    - **Refine and implement the TypeScript interfaces in `types/index.ts` based on a thorough analysis of all JSON files.**
    - **Implement `ielts-data.service.ts` with logic to fetch, parse, validate, and sanitize (e.g., using DOMPurify) the test JSON data.**
    - Create the basic page files: `app/ielts-practice/page.tsx` and `app/ielts-practice/test/[testId]/page.tsx`.

#### Phase 2: Main Page & Navigation (2 days)

1.  **Goal**: Build the main page where users select a test.
2.  **Tasks**:
    - Implement `useIeltsPracticePage` hook.
    - Build `SkillSelector`, `IeltsTestList`, and `IeltsTestCard` components.
    - Connect the page to the data service to list available tests.
    - Ensure clicking a card navigates to the correct test detail page.

#### Phase 3: Listening Test Implementation (3-4 days)

1.  **Goal**: Build the end-to-end experience for the Listening section.
2.  **Tasks**:
    - Implement the `useIeltsTestSession` hook.
    - Build `IeltsTestContainer.tsx` and `TestHeader.tsx`.
    - Build the reusable `AudioPlayer.tsx` with fallback logic.
    - Implement `ListeningSection.tsx`.
    - Implement the question components based on the mapping table.

#### Phase 4: Reading and Writing Sections (4 days)

1.  **Goal**: Implement the Reading and Writing test UIs.
2.  **Tasks**: - Build `ReadingSection.tsx` with the split-pane layout. - Build `WritingSection.tsx` and integrate the `RichTextEditor.tsx`. - Implement any new question types required.
    Session Store: Use Zustand to manage the test session, including tracking the current question, selected answers, and progress.

Question Navigation: Implement functions (goToNextQuestion, goToPreviousQuestion) to handle navigation between questions. The state of the session (e.g., current question index) is updated accordingly.

#### Phase 5: Speaking Section & Test Completion (3 days)

1.  **Goal**: Complete the Speaking section and the test submission flow.
2.  **Tasks**:
    - Build the `VoiceRecorder.tsx` component.
    - Implement `SpeakingSection.tsx`.
    - Implement test submission and results display logic.
    - Implement scoring logic in `ielts-test.service.ts`.

#### Phase 6: Polish & Refinement (2-3 days)

1.  **Goal**: Ensure a high-quality, robust user experience.
2.  **Tasks**:
    - Thoroughly test for responsiveness.
    - Add accessibility features.
    - Optimize performance (lazy loading, code splitting).
    - Implement a "Review Mode."
    - Use `localStorage` to save and resume test progress.

---

This revised plan provides a more detailed and accurate roadmap for developing the IELTS practice feature.
