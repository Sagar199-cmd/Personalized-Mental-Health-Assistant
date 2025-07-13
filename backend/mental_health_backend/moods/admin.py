# moods/admin.py
from django.contrib import admin
from .models.entries import MoodEntry
from .models.insights import AIMoodInsight, AISuggestion

@admin.register(MoodEntry)
class MoodEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'mood', 'intensity', 'timestamp')
    list_filter = ('mood', 'is_auto_detected')
    search_fields = ('user__email', 'notes')
    date_hierarchy = 'timestamp'

@admin.register(AIMoodInsight)
class AIMoodInsightAdmin(admin.ModelAdmin):
    list_display = ('user', 'period_start', 'period_end', 'dominant_mood')
    list_filter = ('dominant_mood',)
    search_fields = ('user__email',)
    date_hierarchy = 'period_end'

@admin.register(AISuggestion)
class AISuggestionAdmin(admin.ModelAdmin):
    list_display = ('insight', 'suggestion_type', 'confidence_score')
    list_filter = ('suggestion_type',)
    search_fields = ('content',)