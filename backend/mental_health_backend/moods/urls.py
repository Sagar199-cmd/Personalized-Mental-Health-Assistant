# moods/urls.py
from django.urls import path
from .views import (
    MoodEntryListCreateAPI, 
    MoodEntryDetailAPI,
    InsightListAPI,
    InsightDetailAPI,
    GenerateInsightAPI
)

urlpatterns = [
    path('entries/', MoodEntryListCreateAPI.as_view(), name='mood-entries'),
    path('entries/<int:id>/', MoodEntryDetailAPI.as_view(), name='mood-entry-detail'),
    path('insights/', InsightListAPI.as_view(), name='insight-list'),
    path('insights/<int:id>/', InsightDetailAPI.as_view(), name='insight-detail'),
    path('insights/generate/', GenerateInsightAPI.as_view(), name='generate-insight'),
]