# moods/serializers.py
from rest_framework import serializers
from .models.entries import MoodEntry
from .models.insights import AIMoodInsight, AISuggestion

class MoodEntrySerializer(serializers.ModelSerializer):
    mood_display = serializers.CharField(source='get_mood_display', read_only=True)
    
    class Meta:
        model = MoodEntry
        fields = [
            'id', 'mood', 'mood_display', 'intensity', 
            'activities', 'notes', 'tags', 'timestamp', 
            'is_auto_detected', 'insight'
        ]
        read_only_fields = ('id', 'timestamp', 'user')

    def validate_intensity(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Intensity must be between 1-5")
        return value

class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISuggestion
        fields = ['id', 'content', 'suggestion_type', 'confidence_score', 'generated_at']

class InsightSerializer(serializers.ModelSerializer):
    suggestions = SuggestionSerializer(many=True, read_only=True)
    moodCorrelations = serializers.SerializerMethodField()
    activityImpact = serializers.SerializerMethodField()
    moodChartData = serializers.SerializerMethodField()
    activityChartData = serializers.SerializerMethodField()

    class Meta:
        model = AIMoodInsight
        fields = [
            'id', 'period_start', 'period_end', 'dominant_mood',
            'moodCorrelations', 'activityImpact', 'suggestions',
            'moodChartData', 'activityChartData', 'intensity_stats'
        ]

    def get_moodCorrelations(self, obj):
        return obj.activity_correlations

    def get_activityImpact(self, obj):
        return {k: abs(v) for k, v in obj.activity_correlations.items()}

    def get_moodChartData(self, obj):
        return {
            'distribution': obj.mood_distribution,
            'timeseries': obj.mood_timeseries
        }

    def get_activityChartData(self, obj):
        return {
            'top_activities': obj.top_activities,
            'correlations': obj.activity_correlations
        }