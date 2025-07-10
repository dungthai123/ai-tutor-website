import { BaseApiService } from './base-api.service';
import {
  ChatApiRequest,
  InitialMessageRequest,
  HintRequest,
  ImproveMessageRequest,
  FeedbackRequest,
  ApiResponse,
  JiebaCollection,
  ImprovedChineseFeedback,
  ConversationFeedback,
  ChatGPTModel,
} from '../../types';

export class ChatApiService extends BaseApiService {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_API_BASE_URL ||
        'https://trumchinese-staging.hackinglanguage.com'
    );
  }

  async fetchTopics(): Promise<ApiResponse<ChatGPTModel[]>> {
    try {
      const response = await this.api.request({
        method: 'GET',
        url: '/api/v1/conversation-topics',
      });
      
      // Transform the API response to match our types
      if (response.data && response.data.success && response.data.data) {
        const transformedData: ChatGPTModel[] = response.data.data.map((item: {
          _id: string;
          name: string;
          topic_details: {
            topic_id: number;
            title: string;
            description: string;
            prompt: string;
            first_message: string;
            image_url: string;
            tasks: string[];
          }[];
        }) => {
          // Transform topic_details to match our frontend types
          const transformedTopicDetails = item.topic_details.map((topic) => ({
            topicId: topic.topic_id,
            title: topic.title,
            description: topic.description,
            prompt: topic.prompt,
            firstMessage: topic.first_message,
            image: topic.image_url,
            tasks: topic.tasks || []
          }));

          return {
            conversationId: item._id,
            index: 0, // Set default index
            name: item.name,
            topicDetails: transformedTopicDetails,
          };
        });
        
        return {
          success: true,
          data: transformedData,
        };
      } else {
        return {
          success: false,
          error: response.data?.message || 'Failed to fetch topics',
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async fetchTopicById(id: string): Promise<ApiResponse<ChatGPTModel>> {
    try {
      const response = await this.api.request({
        method: 'GET',
        url: `/api/v1/conversation-topics/${id}`,
      });
      
      // Transform the API response to match our types
      if (response.data && response.data.success && response.data.data) {
        const item = response.data.data;
        
        // Transform topic_details to match our frontend types
        const transformedTopicDetails = item.topic_details.map((topic: {
          topic_id: number;
          title: string;
          description: string;
          prompt: string;
          first_message: string;
          image_url: string;
          tasks: string[];
        }) => ({
          topicId: topic.topic_id,
          title: topic.title,
          description: topic.description,
          prompt: topic.prompt,
          firstMessage: topic.first_message,
          image: topic.image_url,
          tasks: topic.tasks || []
        }));

        const transformedData: ChatGPTModel = {
          conversationId: item._id,
          index: 0, // Set default index
          name: item.name,
          topicDetails: transformedTopicDetails,
        };
        
        return {
          success: true,
          data: transformedData,
        };
      } else {
        return {
          success: false,
          error: response.data?.message || 'Failed to fetch topic',
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  async initialMessage(
    request: InitialMessageRequest
  ): Promise<ApiResponse<JiebaCollection>> {
    return this.request<JiebaCollection>(
      'POST',
      '/api/v1/ai-speaking-practices/initial-message',
      {
        conversation_id: request.conversationId,
        topic_id: request.topicId,
        chat_session_id: request.chatSessionId,
      }
    );
  }

  async sendMessage(
    request: ChatApiRequest
  ): Promise<ApiResponse<JiebaCollection>> {
    return this.request<JiebaCollection>(
      'POST',
      '/api/v1/ai-speaking-practices/send-message',
      {
        chat_session_id: request.chatSessionId,
        message: request.message,
        conversation_id: request.conversationId,
        topic_id: request.topicId,
        is_segment: false,
      }
    );
  }

  async getHint(request: HintRequest): Promise<ApiResponse<JiebaCollection>> {
    return this.request<JiebaCollection>(
      'POST',
      '/api/v1/ai-speaking-practices/suggest-response',
      {
        conversation_id: request.conversationId,
        topic_id: request.topicId,
        chat_session_id: request.chatSessionId,
        message: request.message,
      }
    );
  }

  async improveMessage(
    request: ImproveMessageRequest
  ): Promise<ApiResponse<ImprovedChineseFeedback>> {
    return this.request<ImprovedChineseFeedback>(
      'POST',
      '/api/v1/ai-speaking-practices/improve-response',
      {
        conversation_id: request.conversationId,
        topic_id: request.topicId,
        chat_session_id: request.chatSessionId,
        question: request.question,
        answer: request.answer,
      }
    );
  }

  async getFeedback(
    request: FeedbackRequest
  ): Promise<ApiResponse<ConversationFeedback>> {
    return this.request<ConversationFeedback>(
      'POST',
      '/api/v1/ai-speaking-practices/feedback',
      {
        conversation_id: request.conversationId,
        topic_id: request.topicId,
        chat_session_id: request.chatSessionId,
      }
    );
  }

  async translateText(
    text: string,
    targetLanguage: string = 'vi'
  ): Promise<ApiResponse<{ translatedText: string }>> {
    return this.request<{ translatedText: string }>(
      'POST',
      '/api/v1/chat-completion/translate',
      {
        fromLanguage: 'zh-Hans',
        toLanguage: targetLanguage,
        text,
      }
    );
  }
}

export const chatApiService = new ChatApiService(); 