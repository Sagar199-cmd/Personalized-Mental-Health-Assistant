from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from moods.models.entries import MoodEntry
from .serializers import MoodEntrySerializer
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from .models.insights import AIMoodInsight
from .serializers import InsightSerializer
from .ai.engine import AdvancedMoodAnalyzer

class MoodEntryListCreateAPI(generics.ListCreateAPIView):
    serializer_class = MoodEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['mood', 'is_auto_detected']
    search_fields = ['notes', 'tags', 'activities']

    def get_queryset(self):
        queryset = MoodEntry.objects.filter(user=self.request.user)
        
        # Date filtering
        date_filter = self.request.query_params.get('date_filter', None)
        if date_filter:
            today = timezone.now().date()
            if date_filter == 'today':
                queryset = queryset.filter(timestamp__date=today)
            elif date_filter == 'week':
                start_date = today - timedelta(days=7)
                queryset = queryset.filter(timestamp__date__gte=start_date)
            elif date_filter == 'month':
                start_date = today - timedelta(days=30)
                queryset = queryset.filter(timestamp__date__gte=start_date)
        
        return queryset.order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MoodEntryDetailAPI(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MoodEntrySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return MoodEntry.objects.filter(user=self.request.user)
    

class InsightListAPI(generics.ListAPIView):
    serializer_class = InsightSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AIMoodInsight.objects.filter(user=self.request.user).order_by('-period_end')

class InsightDetailAPI(generics.RetrieveAPIView):
    serializer_class = InsightSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return AIMoodInsight.objects.filter(user=self.request.user)

class GenerateInsightAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        analyzer = AdvancedMoodAnalyzer(request.user)
        insight = analyzer.generate_insights()
        
        if not insight:
            return Response(
                {'detail': 'Not enough data to generate insights'},
                status=400
            )
        
        serializer = InsightSerializer(insight)
        return Response(serializer.data)