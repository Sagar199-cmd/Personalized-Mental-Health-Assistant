import React, { useState } from 'react';
import { Smile, Frown, Meh, Activity, Tag, Calendar, Edit3 } from 'lucide-react';
import { useMoodStore } from '../../store/moodStore';
import { useAuthStore } from '../../store/authStore';
import { MoodIntensity } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Slider from '../ui/Slider';
import Select from '../ui/Select';
import Badge from '../ui/Badge';

const moodOptions = [
  { value: 'happy', label: 'Happy' },
  { value: 'calm', label: 'Calm' },
  { value: 'excited', label: 'Excited' },
  { value: 'content', label: 'Content' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'sad', label: 'Sad' },
  { value: 'angry', label: 'Angry' },
  { value: 'tired', label: 'Tired' },
];

const activityOptions = [
  'exercise', 'meditation', 'reading', 'work', 'study',
  'socializing', 'family time', 'hobbies', 'entertainment',
  'outdoors', 'cooking', 'cleaning', 'shopping', 'travel',
  'self-care', 'sleeping', 'eating', 'commuting'
];

const MoodLogger: React.FC = () => {
  const { user } = useAuthStore();
  const { addEntry, isLoading } = useMoodStore();
  
  const [mood, setMood] = useState<string>('');
  const [intensity, setIntensity] = useState<MoodIntensity>(3);
  const [activities, setActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [currentActivity, setCurrentActivity] = useState<string>('');
  const [showCamera, setShowCamera] = useState<boolean>(false);
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAddActivity = () => {
    if (currentActivity && !activities.includes(currentActivity)) {
      setActivities([...activities, currentActivity]);
      setCurrentActivity('');
    }
  };
  
  const handleRemoveActivity = (activityToRemove: string) => {
    setActivities(activities.filter(activity => activity !== activityToRemove));
  };
  
  const handleSelectActivity = (activity: string) => {
    if (!activities.includes(activity)) {
      setActivities([...activities, activity]);
    } else {
      setActivities(activities.filter(a => a !== activity));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    await addEntry({
      userId: user.id,
      mood,
      intensity,
      activities,
      notes,
      tags,
    });
    
    // Reset form
    setMood('');
    setIntensity(3);
    setActivities([]);
    setNotes('');
    setTags([]);
  };
  
  const getMoodIcon = () => {
    switch (mood) {
      case 'happy':
      case 'excited':
      case 'content':
        return <Smile className="text-green-500" size={24} />;
      case 'neutral':
      case 'calm':
        return <Meh className="text-blue-500" size={24} />;
      case 'anxious':
      case 'stressed':
      case 'sad':
      case 'angry':
      case 'tired':
        return <Frown className="text-red-500" size={24} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Log Your Mood</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Calendar size={16} />}
          >
            {new Date().toLocaleDateString()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 size={16} />}
            onClick={() => setShowCamera(!showCamera)}
          >
            {showCamera ? 'Hide Camera' : 'Auto Detect'}
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {showCamera && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-center text-gray-500 dark:text-gray-400 mb-2">
                Camera access is required for mood detection
              </p>
              <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">
                  Camera preview would appear here
                </p>
              </div>
              <div className="mt-2 flex justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  disabled={true}
                >
                  Detect Mood
                </Button>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              How are you feeling?
            </label>
            <div className="flex items-center">
              <Select
                options={moodOptions}
                value={mood}
                onChange={setMood}
                fullWidth
              />
              <div className="ml-2 w-8">
                {getMoodIcon()}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Intensity
            </label>
            <Slider
              min={1}
              max={5}
              value={intensity}
              onChange={(value) => setIntensity(value as MoodIntensity)}
              showLabels
              minLabel="Mild"
              maxLabel="Strong"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activities
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {activities.map((activity) => (
                <Badge
                  key={activity}
                  variant="primary"
                  size="md"
                  className="flex items-center"
                  onClick={() => handleRemoveActivity(activity)}
                >
                  {activity}
                  <span className="ml-1 cursor-pointer">&times;</span>
                </Badge>
              ))}
            </div>
            <div className="flex">
              <Input
                placeholder="Add an activity..."
                value={currentActivity}
                onChange={(e) => setCurrentActivity(e.target.value)}
                leftIcon={<Activity size={16} />}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="secondary"
                className="ml-2"
                onClick={handleAddActivity}
              >
                Add
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Common activities:</p>
              <div className="flex flex-wrap gap-2">
                {activityOptions.slice(0, 8).map((activity) => (
                  <Badge
                    key={activity}
                    variant={activities.includes(activity) ? 'primary' : 'default'}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleSelectActivity(activity)}
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="How are you feeling? What's on your mind?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  size="md"
                  className="flex items-center"
                  onClick={() => handleRemoveTag(tag)}
                >
                  #{tag}
                  <span className="ml-1 cursor-pointer">&times;</span>
                </Badge>
              ))}
            </div>
            <div className="flex">
              <Input
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                leftIcon={<Tag size={16} />}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="secondary"
                className="ml-2"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!mood}
            >
              Save Entry
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MoodLogger;