from django.db import models
from .insights import AIMoodInsight
from django.contrib.auth import get_user_model

User = get_user_model()

class MoodEntry(models.Model):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('calm', 'Calm'),
        ('excited', 'Excited'),
        ('content', 'Content'),
        ('neutral', 'Neutral'),
        ('anxious', 'Anxious'),
        ('stressed', 'Stressed'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('tired', 'Tired'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mood_entries')
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES)
    intensity = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    activities = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    tags = models.JSONField(default=list)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_auto_detected = models.BooleanField(default=False)
    insight = models.ForeignKey(  
        AIMoodInsight, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='mood_entries'
    )

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'Mood Entries'

    def __str__(self):
        return f"{self.user.email} - {self.get_mood_display()} ({self.timestamp})"