from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.db.models import Count

from .models import Category, Note
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    CategorySerializer, NoteSerializer, BulkMoveNotesSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """API endpoint for user registration."""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create default categories for new user
        default_categories = [
            {'name': 'Random Thoughts', 'theme_id': 'orange'},
            {'name': 'School', 'theme_id': 'yellow'},
            {'name': 'Personal', 'theme_id': 'teal'},
        ]
        for cat_data in default_categories:
            Category.objects.create(user=user, **cat_data)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """API endpoint for user login."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if user is None:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class LogoutView(APIView):
    """API endpoint for user logout."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    """API endpoint for getting current user."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for CRUD operations on categories.
    Users can only access their own categories.
    """
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user).annotate(notes_count=Count('notes'))
    
    @action(detail=True, methods=['post'])
    def delete_with_notes(self, request, pk=None):
        """Delete category and all its notes."""
        category = self.get_object()
        category.notes.all().delete()
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def move_notes_and_delete(self, request, pk=None):
        """Move all notes to another category, then delete this category."""
        category = self.get_object()
        target_category_id = request.data.get('target_category_id')
        
        if not target_category_id:
            return Response(
                {'error': 'target_category_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            target_category = Category.objects.get(
                id=target_category_id,
                user=request.user
            )
        except Category.DoesNotExist:
            return Response(
                {'error': 'Target category not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        with transaction.atomic():
            category.notes.update(category=target_category)
            category.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoteViewSet(viewsets.ModelViewSet):
    """
    API endpoint for CRUD operations on notes.
    Users can only access their own notes.
    """
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user).select_related('category')
        
        # Filter by category if provided
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def bulk_move(self, request):
        """Move multiple notes to a different category."""
        serializer = BulkMoveNotesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        note_ids = serializer.validated_data['note_ids']
        target_category_id = serializer.validated_data['target_category_id']
        
        try:
            target_category = Category.objects.get(
                id=target_category_id,
                user=request.user
            )
        except Category.DoesNotExist:
            return Response(
                {'error': 'Target category not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        updated_count = Note.objects.filter(
            id__in=note_ids,
            user=request.user
        ).update(category=target_category)
        
        return Response({
            'message': f'Moved {updated_count} notes to {target_category.name}'
        })

