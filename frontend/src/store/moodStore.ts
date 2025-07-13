// moodstore.ts
import { create } from 'zustand';
import { MoodEntry } from '../types';

interface MoodState {
  entries: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  addEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => Promise<void>;
  updateEntry: (id: number, updates: Partial<MoodEntry>) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  fetchEntries: (filters?: { 
    dateFilter?: string, 
    moodFilter?: string, 
    searchTerm?: string 
  }) => Promise<void>;
}

const API_URL = 'http://localhost:8000/api/moods/entries/';

export const useMoodStore = create<MoodState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,
  
  // Fetch entries with filters
  fetchEntries: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.dateFilter) params.append('date_filter', filters.dateFilter);
      if (filters.moodFilter) params.append('mood', filters.moodFilter);
      if (filters.searchTerm) params.append('search', filters.searchTerm);
  
      const response = await fetch(`${API_URL}?${params}`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      
      // Handle paginated response format
      set({ 
        entries: Array.isArray(data) ? data : data.results || [],
        isLoading: false 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  // Add new entry
  addEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...entry,
          user: entry.user, // Django expects user field
          activities: entry.activities || [],
          tags: entry.tags || []
        })
      });

      if (!response.ok) throw new Error('Failed to add entry');
      const newEntry = await response.json();
      
      set(state => ({ 
        entries: [newEntry, ...state.entries],
        isLoading: false 
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Update entry
  updateEntry: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update entry');
      const updatedEntry = await response.json();
      
      set(state => ({
        entries: state.entries.map(entry => 
          entry.id === id ? { ...entry, ...updatedEntry } : entry
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  // Delete entry
  deleteEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete entry');
      
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));