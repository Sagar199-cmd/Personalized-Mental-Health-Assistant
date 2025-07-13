import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

// This is a mock implementation. In a real app, you would connect to a database
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  fetchNotifications: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call - replace with actual database call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId,
          title: 'Time to log your mood',
          message: 'You haven\'t logged your mood today. Take a moment to check in with yourself.',
          type: 'reminder',
          read: false,
          timestamp: new Date(Date.now() - 3600000) // 1 hour ago
        },
        {
          id: '2',
          userId,
          title: 'New insight available',
          message: 'We\'ve generated new insights based on your recent mood entries.',
          type: 'system',
          read: false,
          timestamp: new Date(Date.now() - 86400000), // 1 day ago
          actionUrl: '/insights'
        },
        {
          id: '3',
          userId,
          title: 'Activity suggestion',
          message: 'Based on your mood patterns, a short walk might help you feel better today.',
          type: 'suggestion',
          read: true,
          timestamp: new Date(Date.now() - 172800000) // 2 days ago
        },
        {
          id: '4',
          userId,
          title: 'Upcoming appointment',
          message: 'Reminder: You have a therapy session scheduled for tomorrow at 3:00 PM.',
          type: 'appointment',
          read: true,
          timestamp: new Date(Date.now() - 259200000), // 3 days ago
          actionUrl: '/appointments'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const unreadCount = mockNotifications.filter(n => !n.read).length;
      
      set({ 
        notifications: mockNotifications, 
        unreadCount,
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  markAsRead: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedNotifications = state.notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  markAllAsRead: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        notifications: state.notifications.map(notification => 
          notification.userId === userId ? { ...notification, read: true } : notification
        ),
        unreadCount: 0,
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  deleteNotification: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => {
        const updatedNotifications = state.notifications.filter(
          notification => notification.id !== id
        );
        
        const unreadCount = updatedNotifications.filter(n => !n.read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount,
          isLoading: false
        };
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));