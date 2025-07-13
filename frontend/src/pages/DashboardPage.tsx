import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  BarChart2, 
  Calendar, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Activity 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useMoodStore } from '../store/moodStore';
import { useInsightStore } from '../store/insightStore';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MoodLogger from '../components/mood/MoodLogger';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { entries, fetchEntries, isLoading: moodLoading } = useMoodStore();
  const { insights, fetchInsights, isLoading: insightsLoading } = useInsightStore();
  
  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
      fetchInsights(user.id);
    }
  }, [user, fetchEntries, fetchInsights]);
  
  const latestMood = entries[0];
  const latestInsight = insights[0];
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'User'}
        </h1>
        <div className="mt-4 md:mt-0">
          <Link to="/mood-log/new">
            <Button leftIcon={<PlusCircle size={16} />}>
              Log Mood
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Activity size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mood Entries</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {moodLoading ? <Spinner size="sm" /> : entries.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <TrendingUp size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mood Trend</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {moodLoading ? (
                    <Spinner size="sm" />
                  ) : entries.length > 0 ? (
                    <span className="flex items-center">
                      {getMoodEmoji(entries[0]?.mood || 'neutral')} {entries[0]?.mood || 'Neutral'}
                    </span>
                  ) : (
                    'No data yet'
                  )}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Calendar size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Appointment</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  None scheduled
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood Logger */}
        <div className="lg:col-span-2">
          <MoodLogger />
        </div>
        
        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : entries.length > 0 ? (
                  entries.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {entry.mood} ({entry.intensity}/5)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(entry.timestamp).toLocaleString()}
                        </p>
                        {entry.activities.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {entry.activities.slice(0, 3).map((activity) => (
                              <Badge key={activity} variant="default" size="sm">
                                {activity}
                              </Badge>
                            ))}
                            {entry.activities.length > 3 && (
                              <Badge variant="default" size="sm">
                                +{entry.activities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No mood entries yet. Start logging your mood!
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/mood-log" className="w-full">
                <Button variant="outline" fullWidth>
                  View All Entries
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* AI Insights Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : latestInsight ? (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{latestInsight.title}</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{latestInsight.description}</p>
                  
                  {latestInsight.suggestions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">Suggestions:</h5>
                      <ul className="mt-2 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        {latestInsight.suggestions.slice(0, 2).map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 mr-2">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                        {latestInsight.suggestions.length > 2 && (
                          <li className="text-blue-600 dark:text-blue-400">
                            <Link to="/insights">View all suggestions...</Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    No insights available yet. Keep logging your moods to get personalized insights!
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => user && fetchInsights(user.id)}
                  >
                    Generate Insights
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link to="/insights" className="w-full">
                <Button variant="outline" fullWidth>
                  View All Insights
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300">
                <BarChart2 size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Mood Trends</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analyze your mood patterns over time</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/insights">
                <Button variant="primary" fullWidth>
                  View Trends
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300">
                <Calendar size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Session</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Book a session with a therapist</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/therapist">
                <Button variant="primary" fullWidth>
                  Schedule Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300">
                <MessageSquare size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Message Therapist</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Send a message to your therapist</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/therapist/messages">
                <Button variant="primary" fullWidth>
                  Send Message
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;