import { create } from 'zustand';
import { AIInsight } from '../types';

interface InsightState {
  insights: AIInsight[];
  isLoading: boolean;
  error: string | null;
  generateInsights: (userId: string) => Promise<void>;
  fetchInsights: (userId: string) => Promise<void>;
}

// This is a mock implementation. In a real app, you would connect to an AI service and database
export const useInsightStore = create<InsightState>((set) => ({
  insights: [],
  isLoading: false,
  error: null,
  
  generateInsights: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock AI insight generation - in a real app, this would call your AI service
      const newInsight: AIInsight = {
        id: Math.random().toString(36).substring(2, 9),
        userId,
        title: 'Weekly Mood Analysis',
        description: 'Based on your mood entries this week, we\'ve noticed some patterns that might be helpful.',
        moodCorrelations: {
          'exercise': 0.8,
          'meditation': 0.7,
          'work': -0.3,
          'social': 0.6
        },
        activityImpact: {
          'exercise': 0.75,
          'meditation': 0.65,
          'reading': 0.5,
          'tv': -0.2
        },
        suggestions: [
          'Consider adding more exercise to your routine',
          'Meditation seems to improve your mood significantly',
          'Try to balance work with more social activities'
        ],
        timestamp: new Date()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      set(state => ({ 
        insights: [...state.insights, newInsight],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  fetchInsights: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual database call
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          userId,
          title: 'Monthly Mood Patterns',
          description: 'We\'ve analyzed your mood entries for the past month and found some interesting patterns.',
          moodCorrelations: {
            'exercise': 0.8,
            'meditation': 0.7,
            'work': -0.3,
            'social': 0.6
          },
          activityImpact: {
            'exercise': 0.75,
            'meditation': 0.65,
            'reading': 0.5,
            'tv': -0.2
          },
          suggestions: [
            'Your mood is consistently better after exercise',
            'Consider scheduling regular meditation sessions',
            'Social activities appear to boost your mood significantly'
          ],
          timestamp: new Date(Date.now() - 604800000) // 1 week ago
        },
        {
          id: '2',
          userId,
          title: 'Activity Recommendations',
          description: 'Based on your recent mood entries, here are some activities that might help improve your wellbeing.',
          moodCorrelations: {
            'nature': 0.85,
            'creative': 0.7,
            'screen time': -0.4
          },
          activityImpact: {
            'walking': 0.8,
            'painting': 0.65,
            'journaling': 0.6
          },
          suggestions: [
            'Spending time in nature has a strong positive effect on your mood',
            'Creative activities like painting seem to help you feel better',
            'Consider reducing screen time in the evening'
          ],
          timestamp: new Date(Date.now() - 1209600000) // 2 weeks ago
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ insights: mockInsights, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));