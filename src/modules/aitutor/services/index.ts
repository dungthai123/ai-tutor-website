import { Category, Topic } from '../types';

export class TopicService {
  private static async fetchWithFallback(primaryUrl: string, fallbackUrl: string) {
    try {
      const response = await fetch(primaryUrl);
      if (response.ok) {
        return response;
      }
      console.log('🔄 Fallback to external API...');
      return fetch(fallbackUrl);
    } catch {
      console.log('🔄 Primary API failed, trying fallback...');
      return fetch(fallbackUrl);
    }
  }

  static async fetchCategories(): Promise<{ success: boolean; categories: Category[]; error?: string }> {
    try {
      console.log('🔍 Starting to fetch categories...');
      
      const response = await this.fetchWithFallback(
        '/api/categories',
        'http://127.0.0.1:5001/chinese-categories'
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Categories response:', data);
      
      if (data.success) {
        console.log('✅ Categories loaded successfully:', data.categories);
        return { success: true, categories: data.categories };
      } else {
        console.error('❌ API returned success=false:', data);
        return { success: false, categories: [], error: 'Failed to load categories' };
      }
    } catch (error) {
      console.error('❌ Error in fetchCategories:', error);
      return { 
        success: false, 
        categories: [], 
        error: `Error loading categories: ${(error as Error).message}` 
      };
    }
  }

  static async fetchTopics(categoryId: number): Promise<{ success: boolean; topics: Topic[]; error?: string }> {
    try {
      console.log('🔍 Fetching topics for category:', categoryId);
      
      const response = await this.fetchWithFallback(
        `/api/topics/${categoryId}`,
        `http://127.0.0.1:5001/chinese-topics/${categoryId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📊 Topics response:', data);
      
      if (data.success) {
        console.log('✅ Topics loaded successfully:', data.topics.length, 'topics');
        return { success: true, topics: data.topics };
      } else {
        console.error('❌ Failed to load topics:', data);
        return { success: false, topics: [], error: 'Failed to load topics' };
      }
    } catch (error) {
      console.error('❌ Error loading topics:', error);
      return { 
        success: false, 
        topics: [], 
        error: `Error loading topics: ${(error as Error).message}` 
      };
    }
  }
} 