from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class CustomUser(AbstractUser):
    """Extended user model for the JB's Note Taker app."""
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email


class Category(models.Model):
    """Category model for organizing notes with color themes."""
    THEME_CHOICES = [
        ('orange', 'Orange'),
        ('yellow', 'Yellow'),
        ('green', 'Green'),
        ('teal', 'Teal'),
        ('peach', 'Peach'),
        ('blue', 'Blue'),
        ('pink', 'Pink'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    theme_id = models.CharField(
        max_length=20,
        choices=THEME_CHOICES,
        default='orange'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.name} ({self.user.email})"


class Note(models.Model):
    """Note model with title, content, and category association."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notes'
    )
    title = models.CharField(max_length=255, blank=True, default='')
    content = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.title or 'Untitled'} - {self.user.email}"
