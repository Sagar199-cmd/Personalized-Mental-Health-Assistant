# ai_engine.py
from datetime import timedelta
import pandas as pd # type: ignore
import numpy as np # type: ignore
from scipy.stats import pearsonr # type: ignore
from collections import defaultdict
from django.utils import timezone
from moods.models.entries import MoodEntry
from moods.models.insights import AIMoodInsight, AISuggestion

class AdvancedMoodAnalyzer:
    def __init__(self, user, lookback_days=30):
        self.user = user
        self.lookback_days = lookback_days
        self.df = self._load_data()
        
    def _load_data(self):
        """Load mood entries into a DataFrame with proper timezone handling"""
        start_date = timezone.now() - timedelta(days=self.lookback_days)
        entries = MoodEntry.objects.filter(
            user=self.user,
            timestamp__gte=start_date
        )
        
        if not entries.exists():
            return pd.DataFrame()
            
        return pd.DataFrame.from_records(
            entries.values('timestamp', 'mood', 'intensity', 'activities')
        )

    def _calculate_mood_distribution(self):
        """Calculate frequency of each mood with empty data handling"""
        if self.df.empty:
            return {}
        # Convert numpy types to native Python types
        return {k: int(v) for k, v in self.df['mood'].value_counts().to_dict().items()}

    def _calculate_mood_timeseries(self):
        """Create daily mood timeline with forward filling and ISO date formatting"""
        if self.df.empty:
            return {}
            
        # Convert to datetime and handle timezone
        df = self.df.copy()
        df['timestamp'] = pd.to_datetime(df['timestamp']).dt.tz_convert(timezone.get_current_timezone_name())
        
        # Resample and fill missing values
        series = df.set_index('timestamp').resample('D')['mood'].agg(
            lambda x: x.mode()[0] if not x.empty else None
        ).ffill()
        
        # Convert to ISO format strings for JSON serialization
        return {k.isoformat(): str(v) for k, v in series.to_dict().items()}

    def _calculate_activity_stats(self):
        """Count activity frequencies with empty check"""
        if self.df.empty:
            return {}
            
        activity_counts = defaultdict(int)
        for activities in self.df['activities']:
            if activities:  # Handle empty lists
                for activity in activities:
                    activity_counts[activity] += 1
        return dict(sorted(activity_counts.items(), key=lambda x: x[1], reverse=True))

    def _calculate_correlations(self):
        """Calculate mood-activity correlations safely"""
        if self.df.empty or len(self.df) < 4:
            return {}

        # Get unique activities
        all_activities = set()
        for activities in self.df['activities']:
            all_activities.update(activities)
        unique_activities = list(all_activities)

        activity_presence = defaultdict(list)
        mood_intensity = self.df['intensity'].tolist()
        
        for activities in self.df['activities']:
            for activity in unique_activities:
                activity_presence[activity].append(1 if activity in activities else 0)
        
        correlations = {}
        for activity, presence in activity_presence.items():
            if sum(presence) >= 3:  # Minimum 3 occurrences
                try:
                    corr, _ = pearsonr(presence, mood_intensity)
                    # Convert numpy float to native Python float
                    correlations[activity] = float(round(corr, 2))
                except Exception as e:
                    continue
        return correlations

    def generate_insights(self):
        """Main method to generate insights with error handling"""
        try:
            if self.df.empty:
                return None
                
            insight_data = {
                'mood_distribution': self._calculate_mood_distribution(),
                'mood_timeseries': self._calculate_mood_timeseries(),
                'top_activities': self._calculate_activity_stats(),
                'activity_correlations': self._calculate_correlations(),
                'dominant_mood': str(self.df['mood'].mode()[0]) if not self.df.empty else None,
                'intensity_stats': {
                    'average': float(round(self.df['intensity'].mean(), 1)),
                    'max': int(self.df['intensity'].max()),
                    'min': int(self.df['intensity'].min())
                }
            }
            
            insight = self._create_insight_object(insight_data)
            self._generate_suggestions(insight, insight_data)
            return insight
            
        except Exception as e:
            print(f"Error generating insights: {str(e)}")
            return None

    def _create_insight_object(self, data):
        """Create AIMoodInsight object with proper type conversion"""
        return AIMoodInsight.objects.create(
            user=self.user,
            period_start=timezone.now() - timedelta(days=self.lookback_days),
            period_end=timezone.now(),
            mood_distribution=data['mood_distribution'],
            mood_timeseries=data['mood_timeseries'],
            top_activities=data['top_activities'],
            activity_correlations=data['activity_correlations'],
            intensity_stats=data['intensity_stats'],
            dominant_mood=data['dominant_mood']
        )

    def _generate_suggestions(self, insight, data):
        """Generate AI suggestions with validation"""
        suggestions = []
        
        # Mood distribution suggestion
        if data['mood_distribution']:
            top_mood, top_count = max(
                data['mood_distribution'].items(), 
                key=lambda x: x[1],
                default=(None, None)
            )
            if top_mood:
                suggestions.append(f"Your most frequent mood was {top_mood} ({top_count} times).")

        # Activity correlation suggestions
        if data['activity_correlations']:
            for activity, corr in data['activity_correlations'].items():
                if corr > 0.4:
                    suggestions.append(f"Keep up with {activity}, it's positively impacting your mood!")
                elif corr < -0.4:
                    suggestions.append(f"Consider reducing {activity} as it correlates with lower moods.")

        # Intensity based suggestions
        if data['intensity_stats']:
            avg_intensity = data['intensity_stats'].get('average', 0)
            if avg_intensity < 2.5:
                suggestions.append("Your average mood intensity is low. Consider engaging in uplifting activities.")
                
        # Create suggestion objects
        for content in suggestions:
            AISuggestion.objects.create(
                insight=insight,
                content=content,
                suggestion_type='auto_generated'
            )