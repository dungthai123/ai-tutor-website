'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PracticeType, PracticeTopicModel, HSKLevel } from '@/modules/practice/types';
import { PracticeService } from '@/modules/practice/services';
import { MainLayout } from '@/shared/components/layout/MainLayout';
import { Button } from '@/shared/components/ui/buttons/Button';
import { Card } from '@/shared/components/ui/cards/Card';

type TestMode = 'practice' | 'test';

export default function TestIntroPage() {
  const params = useParams();
  const router = useRouter();
  
  const testType = params.type as PracticeType;
  const testId = params.id as string;
  
  const [topic, setTopic] = useState<PracticeTopicModel | null>(null);
  const [selectedMode, setSelectedMode] = useState<TestMode>('practice');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load topic information
  useEffect(() => {
    const loadTopic = async () => {
      setLoading(true);
      try {
        const { topic: topicData } = await PracticeService.initializeTest(testType, testId);
        setTopic(topicData);
      } catch (err) {
        console.error('Failed to load topic:', err);
        setError('Failed to load test information');
      } finally {
        setLoading(false);
      }
    };

    loadTopic();
  }, [testType, testId]);

  const handleStartTest = () => {
    router.push(`/practice/${testType}/test/${testId}/start?mode=${selectedMode}`);
  };

  const handleBack = () => {
    // Navigate back to main practice page instead of type-specific page
    router.push('/practice');
  };

  const getTimeLimit = (level: HSKLevel): number => {
    return level === HSKLevel.HSK4 || level === HSKLevel.HSK5 || level === HSKLevel.HSK6 ? 40 : 30;
  };

  const formatTestType = (type: PracticeType): string => {
    switch (type) {
      case PracticeType.LISTENING:
        return 'Listening Comprehension';
      case PracticeType.READING:
        return 'Reading Comprehension';
      case PracticeType.WRITING:
        return 'Writing';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading test information...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !topic) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Test</h2>
            <p className="text-gray-600 mb-4">{error || 'Test not found'}</p>
            <Button onClick={handleBack} variant="secondary">
              Back to Topics
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button 
              onClick={handleBack}
              variant="secondary"
              className="mb-4"
            >
              ← Back to Topics
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Introduction</h1>
            <p className="text-gray-600">Review the test details and select your preferred mode</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Test Name:</span>
                  <span className="font-medium">{topic.title}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">{topic.level}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Question Type:</span>
                  <span className="font-medium">{formatTestType(testType)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium">{topic.totalQuestions}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium">{getTimeLimit(topic.level)} minutes</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium capitalize">{topic.difficulty}</span>
                </div>
              </div>

              {topic.description && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Description</h3>
                  <p className="text-blue-800 text-sm">{topic.description}</p>
                </div>
              )}
            </Card>

            {/* Mode Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Practice Mode</h2>
              
              <div className="space-y-4">
                {/* Practice Mode */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMode === 'practice' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMode('practice')}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedMode === 'practice' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedMode === 'practice' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">Practice Mode</h3>
                  </div>
                  <ul className="text-sm text-gray-600 ml-7 space-y-1">
                    <li>• Review answers immediately after each question</li>
                    <li>• No time pressure</li>
                    <li>• Can navigate freely between questions</li>
                    <li>• Perfect for learning and improvement</li>
                  </ul>
                </div>

                {/* Test Mode */}
                <div 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMode === 'test' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedMode('test')}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedMode === 'test' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedMode === 'test' && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">Test Mode</h3>
                  </div>
                  <ul className="text-sm text-gray-600 ml-7 space-y-1">
                    <li>• Timed test with {getTimeLimit(topic.level)}-minute limit</li>
                    <li>• Results shown only at the end</li>
                    <li>• Simulates real exam conditions</li>
                    <li>• Best for assessment and preparation</li>
                  </ul>
                </div>
              </div>

              {/* Start Button */}
              <div className="mt-8">
                <Button
                  onClick={handleStartTest}
                  className="w-full py-3 text-lg font-medium"
                  variant="primary"
                >
                  Start {selectedMode === 'practice' ? 'Practice' : 'Test'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 