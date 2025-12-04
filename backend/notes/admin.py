from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Category, Note


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'username', 'is_staff', 'date_joined']
    search_fields = ['email', 'username']
    ordering = ['-date_joined']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'theme_id', 'created_at']
    list_filter = ['theme_id', 'user']
    search_fields = ['name', 'user__email']


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'updated_at']
    list_filter = ['category', 'user']
    search_fields = ['title', 'content', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
