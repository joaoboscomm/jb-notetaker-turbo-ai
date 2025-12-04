# JB's Note Taker - Turbo AI

A charming note-taking application with a beautiful pastel aesthetic, built with Django REST Framework (backend) and Next.js (frontend).

## 🌟 Features

- **User Authentication**: Sign up, login, and logout with JWT-based authentication
- **Note Management**: Create, edit, and delete notes with auto-save functionality
- **Category Organization**: Organize notes into customizable, color-coded categories
- **Category Engine**: Full CRUD operations for categories with smart deletion options
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Collapsible Sidebar**: Space-efficient navigation with expand/collapse functionality
- **Bulk Operations**: Move multiple notes between categories at once

## 🏗️ Tech Stack

### Backend
- **Framework**: Django 6.0 with Django REST Framework
- **Authentication**: JWT tokens via `djangorestframework-simplejwt`
- **Database**: SQLite (development) / PostgreSQL (production-ready)
- **CORS**: Configured with `django-cors-headers`

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 Project Structure

```
charming-notes/
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── notes/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── manage.py
│   └── db.sqlite3
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── globals.css
    │   │   └── login/
    │   │       └── page.tsx
    │   ├── components/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── NoteCard.tsx
    │   │   ├── NoteEditor.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── CategoryManager.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── lib/
    │   │   ├── api.ts
    │   │   └── constants.ts
    │   └── types/
    │       └── index.ts
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd charming-notes/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. (Optional) Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd charming-notes/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and set NEXT_PUBLIC_API_URL if needed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| GET | `/api/auth/user/` | Get current user |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List all categories |
| POST | `/api/categories/` | Create a category |
| GET | `/api/categories/{id}/` | Get a category |
| PATCH | `/api/categories/{id}/` | Update a category |
| DELETE | `/api/categories/{id}/` | Delete a category |
| POST | `/api/categories/{id}/delete_with_notes/` | Delete category and its notes |
| POST | `/api/categories/{id}/move_notes_and_delete/` | Move notes then delete category |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/` | List all notes |
| POST | `/api/notes/` | Create a note |
| GET | `/api/notes/{id}/` | Get a note |
| PATCH | `/api/notes/{id}/` | Update a note |
| DELETE | `/api/notes/{id}/` | Delete a note |
| POST | `/api/notes/bulk_move/` | Move multiple notes |

## 🎨 Design System

### Colors
- Background: `#FBF7F0`
- Text: `#4A3B2C`
- Border: `#8B7355`
- Input Background: `#F3EFE6`
- Accent: `#F4EBD0`

### Category Themes
- Orange: `#F2B989` / `#C06626`
- Yellow: `#F9E5A8` / `#D4AF37`
- Green: `#C8D5B9` / `#788F63`
- Teal: `#90B4B5` / `#4A7A7B`
- Peach: `#F5CBA7` / `#D35400`
- Blue: `#AED6F1` / `#2E86C1`
- Pink: `#F5B7B1` / `#C0392B`

### Fonts
- Headings: Playfair Display (serif)
- Body: DM Sans (sans-serif)

## 🔒 Security Notes

For production deployment:
1. Change `SECRET_KEY` in Django settings
2. Set `DEBUG = False`
3. Configure proper `ALLOWED_HOSTS`
4. Use PostgreSQL instead of SQLite
5. Enable HTTPS
6. Update CORS settings for production domain

## 📝 License

MIT License
