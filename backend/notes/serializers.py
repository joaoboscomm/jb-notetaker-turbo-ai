from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Category, Note

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data."""
    class Meta:
        model = User
        fields = ['id', 'email', 'username']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        attrs.pop('password2')
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for categories."""
    notes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'theme_id', 'notes_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'notes_count']
    
    def get_notes_count(self, obj):
        if hasattr(obj, 'notes_count'):
            return obj.notes_count
        return obj.notes.count()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class NoteSerializer(serializers.ModelSerializer):
    """Serializer for notes."""
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        allow_null=True,
        required=False
    )
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_theme = serializers.CharField(source='category.theme_id', read_only=True)
    
    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'category_id', 
            'category_name', 'category_theme',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'category_name', 'category_theme']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate_category_id(self, value):
        """Ensure the category belongs to the current user."""
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("Invalid category.")
        return value


class BulkMoveNotesSerializer(serializers.Serializer):
    """Serializer for bulk moving notes to another category."""
    note_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=True
    )
    target_category_id = serializers.IntegerField(required=True)
