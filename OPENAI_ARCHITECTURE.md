# OpenAI Service Architecture

## 🏗️ **Cấu Trúc Tổng Quan**

```
src/
├── shared/services/
│   ├── openai.service.ts     # Shared OpenAI logic
│   └── index.ts              # Service exports
├── app/api/
│   ├── chat/route.ts         # Chatbot API
│   ├── ai-tutor/route.ts     # AI Tutor API
│   └── practice-feedback/route.ts # Practice feedback API
└── modules/
    ├── chatbot/              # Uses shared service
    ├── aitutor/services/     # Client-side AI tutor services
    └── practice/services/    # Client-side practice services
```

## 🎯 **Nguyên Tắc Thiết Kế**

### 1. **Separation of Concerns**

- **Shared Service**: Xử lý logic OpenAI core
- **API Routes**: Validate request + gọi shared service
- **Module Services**: Client-side API calls

### 2. **DRY (Don't Repeat Yourself)**

- Một OpenAI client instance duy nhất
- Tái sử dụng configs và logic
- Centralized error handling

### 3. **Type Safety**

- Strong typing cho tất cả interfaces
- Consistent API responses
- Type-safe configurations

## 🔧 **Shared OpenAI Service**

### **Core Features:**

```typescript
// Generic function for all use cases
OpenAIService.createChatCompletion(messages, config);

// Specialized functions
OpenAIService.chatbotResponse(message, history);
OpenAIService.tutorResponse(input, context);
OpenAIService.provideFeedback(exercise, answer);
OpenAIService.checkGrammar(text);
```

### **Pre-configured Settings:**

```typescript
OPENAI_CONFIGS = {
  CHATBOT: {
    model: "gpt-4o-mini",
    maxTokens: 500,
    temperature: 0.7,
  },
  AI_TUTOR: {
    model: "gpt-4o",
    maxTokens: 800,
    temperature: 0.5,
  },
  PRACTICE_FEEDBACK: {
    model: "gpt-4o-mini",
    maxTokens: 300,
    temperature: 0.3,
  },
};
```

## 📋 **Sử Dụng Trong Từng Module**

### **1. Chatbot Module**

```typescript
// API Route: /api/chat/route.ts
import { chatbotResponse } from "@/shared/services";

const reply = await chatbotResponse(message, conversationHistory);
```

### **2. AI Tutor Module**

```typescript
// API Route: /api/ai-tutor/route.ts
import { tutorResponse } from "@/shared/services";

const feedback = await tutorResponse(studentInput, context);

// Client Service: modules/aitutor/services/
import { getTutorFeedback } from "./ai-tutor.service";

const feedback = await getTutorFeedback(input, context);
```

### **3. Practice Module**

```typescript
// API Route: /api/practice-feedback/route.ts
import { provideFeedback } from "@/shared/services";

const feedback = await provideFeedback(exercise, userAnswer, correctAnswer);

// Client Service: modules/practice/services/
import { getPracticeFeedback } from "./practice-ai.service";

const feedback = await getPracticeFeedback(exercise, answer);
```

## 🚀 **Ví Dụ Sử Dụng**

### **Trong Component React:**

```typescript
// Chatbot
import { useChat } from "@/modules/chatbot";
const { sendMessage } = useChat();

// AI Tutor
import { getTutorFeedback } from "@/modules/aitutor/services";
const feedback = await getTutorFeedback("Check my grammar", "I are good");

// Practice
import { evaluateAnswer } from "@/modules/practice/services";
const result = await evaluateAnswer(question, userAnswer, correctAnswer);
```

### **Trong Custom Hooks:**

```typescript
// Hook for AI tutor feedback
export function useAITutor() {
  const [loading, setLoading] = useState(false);

  const getFeedback = async (input: string, context?: string) => {
    setLoading(true);
    try {
      return await getTutorFeedback(input, context);
    } finally {
      setLoading(false);
    }
  };

  return { getFeedback, loading };
}
```

## 🎨 **Lợi Ích Của Cấu Trúc Này**

### ✅ **Code Reusability**

- Một shared service cho tất cả modules
- Không duplicate OpenAI logic
- Easy to maintain và update

### ✅ **Scalability**

- Thêm module mới chỉ cần import shared service
- Dễ dàng thêm configs mới
- Modular architecture

### ✅ **Type Safety**

- Consistent interfaces across modules
- Compile-time error checking
- Better IDE support

### ✅ **Testing**

- Mock shared service for unit tests
- Isolated testing cho từng module
- Easy to test API routes

### ✅ **Performance**

- Single OpenAI client instance
- Optimized token usage
- Consistent error handling

## 📝 **Best Practices**

### **1. Module Services**

```typescript
// ✅ Good: Specific function names
getTutorFeedback();
evaluateAnswer();
checkGrammar();

// ❌ Bad: Generic names
getAIResponse();
callOpenAI();
```

### **2. Error Handling**

```typescript
// ✅ Good: Specific error messages
throw new Error("Failed to get tutor feedback");

// ❌ Bad: Generic errors
throw new Error("Something went wrong");
```

### **3. Configuration**

```typescript
// ✅ Good: Use pre-defined configs
OPENAI_CONFIGS.AI_TUTOR

// ❌ Bad: Inline configuration
{ model: 'gpt-4o', maxTokens: 800, temperature: 0.5 }
```

## 🔮 **Future Extensions**

### **Thêm Module Mới:**

1. Tạo config trong `OPENAI_CONFIGS`
2. Thêm specialized function trong `OpenAIService`
3. Tạo API route trong `app/api/`
4. Tạo client service trong module

### **Tính Năng Mở Rộng:**

- Streaming responses
- File upload support
- Voice input/output
- Multi-language support
- Conversation persistence
- Rate limiting
- Caching responses

Cấu trúc này đảm bảo code **clean**, **maintainable**, và **scalable** cho tất cả các use cases OpenAI trong ứng dụng của bạn! 🎯
