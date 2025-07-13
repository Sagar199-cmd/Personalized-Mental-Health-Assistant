export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
  therapistId?: string;
}

export interface Therapist {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  specialization: string[];
  licenseNumber: string;
  verified: boolean;
  patients: string[];
}

export type MoodIntensity = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: number; 
  user: number; 
  mood: string;
  intensity: number;
  activities: string[];
  notes: string;
  tags: string[];
  timestamp: string; 
  is_auto_detected?: boolean; 
}

export interface Appointment {
  id: string;
  userId: string;
  therapistId: string;
  date: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'suggestion' | 'appointment' | 'system';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
}

export interface AIInsight {
  id: string;
  userId: string;
  title: string;
  description: string;
  moodCorrelations: Record<string, number>;
  activityImpact: Record<string, number>;
  suggestions: string[];
  timestamp: Date;
}