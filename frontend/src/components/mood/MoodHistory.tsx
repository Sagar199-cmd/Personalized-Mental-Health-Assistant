import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Filter, Calendar, Search } from 'lucide-react';
import { useMoodStore } from '../../store/moodStore';
import { useAuthStore } from '../../store/authStore';
import { MoodEntry } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';

const MoodHistory: React.FC = () => {
  const { user } = useAuthStore();
  const { entries, fetchEntries, updateEntry, deleteEntry, isLoading } = useMoodStore();
  
  const [filteredEntries, setFilteredEntries] = useState<MoodEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state for editing
  const [editMood, setEditMood] = useState('');
  const [editIntensity, setEditIntensity] = useState<number>(3);
  const [editNotes, setEditNotes] = useState('');
  
  useEffect(() => {
    fetchEntries({
      dateFilter,
      moodFilter,
      searchTerm
    });
  }, [dateFilter, moodFilter, searchTerm]);
  
  useEffect(() => {
    filterEntries();
  }, [entries, searchTerm, moodFilter, dateFilter]);
  
  const filterEntries = () => {
    let filtered = [...entries];
    
    // Filter by mood
    if (moodFilter !== 'all') {
      filtered = filtered.filter(entry => entry.mood === moodFilter);
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(entry => new Date(entry.timestamp) >= cutoffDate);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.mood.toLowerCase().includes(term) ||
        entry.notes.toLowerCase().includes(term) ||
        entry.tags.some(tag => tag.toLowerCase().includes(term)) ||
        entry.activities.some(activity => activity.toLowerCase().includes(term))
      );
    }
    
    setFilteredEntries(filtered);
  };
  
  const handleEditClick = (entry: MoodEntry) => {
    setSelectedEntry(entry);
    setEditMood(entry.mood);
    setEditIntensity(entry.intensity);
    setEditNotes(entry.notes);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (entry: MoodEntry) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };
  
  const handleSaveEdit = async () => {
    if (!selectedEntry) return;
    
    await updateEntry(selectedEntry.id, {
      mood: editMood,
      intensity: editIntensity as any,
      notes: editNotes
    });
    
    setIsEditModalOpen(false);
    setSelectedEntry(null);
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedEntry) return;
    
    await deleteEntry(selectedEntry.id);
    
    setIsDeleteModalOpen(false);
    setSelectedEntry(null);
  };
  
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
  
  const uniqueMoods = Array.from(new Set(entries.map(entry => entry.mood)));
  
  if (isLoading && entries.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Mood History</h2>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={16} />}
              className="w-full sm:w-auto"
            />
            
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filter
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Filter by mood"
              options={[
                { value: 'all', label: 'All moods' },
                ...uniqueMoods.map(mood => ({ value: mood, label: `${getMoodEmoji(mood)} ${mood}` }))
              ]}
              value={moodFilter}
              onChange={setMoodFilter}
            />
            
            <Select
              label="Filter by date"
              options={[
                { value: 'all', label: 'All time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 days' },
                { value: 'month', label: 'Last 30 days' },
              ]}
              value={dateFilter}
              onChange={setDateFilter}
            />
          </div>
        )}
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{getMoodEmoji(entry.mood)}</div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                        {entry.mood}
                      </h3>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        (Intensity: {entry.intensity}/5)
                      </span>
                      {entry.is_auto_detected && (
                        <Badge variant="info" size="sm" className="ml-2">
                          AI Detected
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar size={14} className="inline mr-1" />
                      {format(new Date(entry.timestamp), 'MMMM d, yyyy h:mm a')}
                    </p>
                    
                    {entry.notes && (
                      <p className="mt-2 text-gray-700 dark:text-gray-300">{entry.notes}</p>
                    )}
                    
                    {entry.activities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Activities:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.activities.map((activity) => (
                            <Badge key={activity} variant="default" size="sm">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.tags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center mt-4 sm:mt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit size={16} />}
                    onClick={() => handleEditClick(entry)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Trash2 size={16} />}
                    onClick={() => handleDeleteClick(entry)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {entries.length > 0 
                ? 'No entries match your filters. Try adjusting your search criteria.'
                : 'No mood entries yet. Start logging your mood to see your history here.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Mood Entry"
      >
        <div className="space-y-4">
          <Select
            label="Mood"
            options={uniqueMoods.map(mood => ({ value: mood, label: `${getMoodEmoji(mood)} ${mood}` }))}
            value={editMood}
            onChange={setEditMood}
            fullWidth
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Intensity
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="1"
                max="5"
                value={editIntensity}
                onChange={(e) => setEditIntensity(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">{editIntensity}/5</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Mood Entry"
      >
        <div>
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this mood entry? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MoodHistory;