import React, { useEffect, useState } from 'react';
import { 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  RefreshCw, 
  Calendar, 
  Clock,
  Download
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import { useMoodStore } from '../store/moodStore';
import { useInsightStore } from '../store/insightStore';
import { MoodEntry } from '../types';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';

// Mock chart component (in a real app, you would use Chart.js or another library)
const MockChart: React.FC<{ type: 'bar' | 'line' | 'pie'; height?: number }> = ({ type, height = 200 }) => {
  return (
    <div 
      className="bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <div className="text-center text-gray-500 dark:text-gray-400">
        <div className="mb-2">
          {type === 'bar' && <BarChart2 size={32} className="mx-auto" />}
          {type === 'line' && <TrendingUp size={32} className="mx-auto" />}
          {type === 'pie' && <PieChart size={32} className="mx-auto" />}
        </div>
        <p>Chart visualization would appear here</p>
        <p className="text-sm">(Using Chart.js in a real implementation)</p>
      </div>
    </div>
  );
};

const InsightsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { entries: rawEntries = [], fetchEntries, isLoading: moodLoading } = useMoodStore();
  const entries = Array.isArray(rawEntries) ? rawEntries : [];
  const { insights, generateInsights, fetchInsights, isLoading: insightsLoading } = useInsightStore();
  
  const [timeRange, setTimeRange] = useState('30');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
      fetchInsights(user.id);
    }
  }, [user, fetchEntries, fetchInsights]);
  
  const handleGenerateInsights = async () => {
    if (!user) return;
    
    setIsGeneratingInsights(true);
    await generateInsights(user.id);
    setIsGeneratingInsights(false);
  };
  
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const cutoffDate = subDays(new Date(), parseInt(timeRange));
    return entryDate >= cutoffDate;
  });
  
  // Calculate mood distribution
  const moodCounts: Record<string, number> = {};
  filteredEntries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  
  // Calculate activity frequency
  const activityCounts: Record<string, number> = {};
  filteredEntries.forEach(entry => {
    entry.activities.forEach(activity => {
      activityCounts[activity] = (activityCounts[activity] || 0) + 1;
    });
  });
  
  // Sort activities by frequency
  const sortedActivities = Object.entries(activityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights & Analytics</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <Select
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
              { value: '365', label: 'Last year' },
            ]}
            value={timeRange}
            onChange={setTimeRange}
          />
          
          <Button
            leftIcon={<RefreshCw size={16} />}
            onClick={handleGenerateInsights}
            isLoading={isGeneratingInsights}
          >
            Generate New Insights
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Calendar size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Period</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Last {timeRange} days
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <BarChart2 size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mood Entries</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {moodLoading ? <Spinner size="sm" /> : filteredEntries.length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Clock size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {insights.length > 0 
                    ? format(new Date(insights[0].timestamp), 'MMM d, yyyy')
                    : 'No insights yet'}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : filteredEntries.length > 0 ? (
              <>
                <MockChart type="pie" height={250} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Object.entries(moodCounts).map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <span className="capitalize flex items-center">
                        {getMoodEmoji(mood)} {mood}
                      </span>
                      <Badge variant="default">
                        {count} ({Math.round((count / filteredEntries.length) * 100)}%)
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No mood data available for the selected time period.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
              Export Data
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mood Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : filteredEntries.length > 0 ? (
              <MockChart type="line" height={250} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No mood data available for the selected time period.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
              Export Data
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : sortedActivities.length > 0 ? (
              <>
                <MockChart type="bar" height={250} />
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Most frequent activities:
                  </h4>
                  <div className="space-y-2">
                    {sortedActivities.map(([activity, count]) => (
                      <div key={activity} className="flex items-center justify-between">
                        <span className="capitalize">{activity}</span>
                        <Badge variant="default">
                          {count} times
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No activity data available for the selected time period.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" fullWidth leftIcon={<Download size={16} />}>
              Export Data
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mood-Activity Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            {moodLoading || insightsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : insights.length > 0 && insights[0].activityImpact ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  These activities appear to have the strongest impact on your mood:
                </p>
                
                <div className="space-y-3">
                  {Object.entries(insights[0].activityImpact)
                    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                    .map(([activity, impact]) => (
                      <div key={activity} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{activity}</span>
                          <Badge 
                            variant={impact > 0 ? 'success' : 'danger'}
                            size="sm"
                          >
                            {impact > 0 ? 'Positive' : 'Negative'} Impact
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              impact > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.abs(impact) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No correlation data available yet. Generate insights to see correlations.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleGenerateInsights}
                  isLoading={isGeneratingInsights}
                >
                  Generate Insights
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {insightsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : insights.length > 0 ? (
            <div className="space-y-6">
              {insights.map((insight) => (
                <div key={insight.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{insight.title}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{insight.description}</p>
                  
                  {insight.suggestions.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Suggestions:</h4>
                      <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {insight.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 mr-2">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                    Generated on {format(new Date(insight.timestamp), 'MMMM d, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No insights available yet. Generate insights to see personalized recommendations.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={handleGenerateInsights}
                isLoading={isGeneratingInsights}
              >
                Generate Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get mood emoji
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

export default InsightsPage;