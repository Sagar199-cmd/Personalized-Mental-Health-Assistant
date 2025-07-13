import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });

    } catch (error) {
      localStorage.removeItem('token');
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        isLoading: false 
      });

    } catch (error) {
      localStorage.removeItem('token');
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }

      // Clear token and user data
      localStorage.removeItem('token');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });

    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  resetPassword: async (email: string) => {
    // Not implemented for now
  },
}));