import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { useMoodStore } from '../store/moodStore';
import { MoodEntry } from '../types';
import Button from '../components/ui/Button';
import MoodHistory from '../components/mood/MoodHistory';
import MoodLogger from '../components/mood/MoodLogger';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

const MoodLogPage: React.FC = () => {
  const { entries, fetchEntries, isLoading } = useMoodStore();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showMoodLogger, setShowMoodLogger] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchEntries();
        setError(null);
      } catch (err) {
        setError('Failed to load mood entries. Please try again.');
      }
    };
    
    loadData();
  }, [fetchEntries]);

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'excited': return '😃';
      case 'content': return '🙂';
      case 'neutral': return '😐';
      case 'anxious': return '😰';
      case 'stressed': return '😓';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'tired': return '😴';
      default: return '🤔';
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntriesForDay = (day: Date): MoodEntry[] => {
    return entries.filter(entry => {
      if (!entry.timestamp) return false;
      const entryDate = new Date(entry.timestamp);
      return isSameDay(entryDate, day);
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const tabs = [
    {
      id: 'list',
      label: 'List View',
      content: <MoodHistory />
    },
    {
      id: 'calendar',
      label: 'Calendar View',
      content: (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Mood Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                leftIcon={<ChevronLeft size={16} />}
              >
                Previous
              </Button>
              <span className="text-lg font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                rightIcon={<ChevronRight size={16} />}
              >
                Next
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-24 rounded-md"></div>
              ))}
              
              {days.map((day) => {
                const dayEntries = getEntriesForDay(day);
                const hasEntries = dayEntries.length > 0;
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`h-24 p-1 rounded-md border ${
                      hasEntries
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                      {format(day, 'd')}
                    </div>
                    <div className="mt-1 overflow-y-auto max-h-16">
                      {dayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="text-xs mb-1 flex items-center"
                          title={entry.notes}
                        >
                          <span className="mr-1">{getMoodEmoji(entry.mood)}</span>
                          <span className="capitalize truncate">{entry.mood}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {Array.from({ length: (6 - (monthEnd.getDay() || 0)) }).map((_, index) => (
                <div key={`empty-end-${index}`} className="h-24 rounded-md"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mood Log</h1>
        <Button
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setShowMoodLogger(!showMoodLogger)}
        >
          {showMoodLogger ? 'Hide Logger' : 'Log Mood'}
        </Button>
      </div>

      {showMoodLogger && (
        <div className="mb-8">
          <MoodLogger />
        </div>
      )}

      {error ? (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-md">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <Tabs tabs={tabs} defaultTabId="list" />
      )}
    </div>
  );
};

export default MoodLogPage;