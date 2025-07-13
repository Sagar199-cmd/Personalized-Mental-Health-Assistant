from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AIMoodInsight(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='insights')
    period_start = models.DateField()
    period_end = models.DateField()
    dominant_mood = models.CharField(max_length=20)
    mood_distribution = models.JSONField(default=dict)  # For pie chart
    mood_timeseries = models.JSONField(default=dict)    # For line chart
    top_activities = models.JSONField(default=dict)     # For bar chart
    activity_correlations = models.JSONField(default=dict)  # For correlation list
    intensity_stats = models.JSONField(default=dict)    # For stats cards
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-period_end']
        verbose_name = 'AI Mood Insight'
        verbose_name_plural = 'AI Mood Insights'

    def __str__(self):
        return f"{self.user}'s Insight ({self.period_start} to {self.period_end})"

class AISuggestion(models.Model):
    insight = models.ForeignKey(AIMoodInsight, on_delete=models.CASCADE, related_name='suggestions')
    suggestion_type = models.CharField(max_length=50, choices=[
        ('activity', 'Activity Recommendation'),
        ('pattern', 'Pattern Recognition'),
        ('warning', 'Mood Warning')
    ])
    content = models.TextField()
    confidence_score = models.FloatField(null=True, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-generated_at']
        verbose_name = 'AI Suggestion'
        verbose_name_plural = 'AI Suggestions'

    def __str__(self):
        return f"{self.suggestion_type} for {self.insight.user}"