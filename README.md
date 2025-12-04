# JB's Note Taker - Turbo AI

<img width="1247" height="859" alt="image" src="https://github.com/user-attachments/assets/78530188-f3bf-468d-8889-d3a001433e4f" />


# JB's Note Taker - Turbo AI

A charming, pastel-themed note-taking application built with **Django REST Framework** and **Next.js**, featuring user authentication, dynamic category management, and auto-saving notes.

Presentation URL: https://docs.google.com/presentation/d/11Te5v9t16gFYwjF4HXFjCQqn1hb_Z2lsx8xDs1RoXfw/edit?usp=sharing


---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Methodology](#development-methodology)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [API Documentation](#api-documentation)
8. [Design System](#design-system)
9. [Future Improvements](#future-improvements)

---

## 🎯 Project Overview

This project was developed as part of a technical assessment for Turbo AI. The challenge was to recreate a note-taking application following specific design requirements and technology constraints (Django + Next.js stack).

Rather than diving straight into code, I adopted a **structured, iterative approach** that prioritized understanding requirements, rapid prototyping, and incremental refinement.

---

## 🧠 Development Methodology

My approach to this challenge followed a deliberate, multi-phase process designed to minimize rework and maximize quality:

### Phase 1: Requirements Analysis & Documentation

**Objective:** Fully understand the scope before writing any code.

- Thoroughly reviewed the challenge documentation on Notion
- Watched the demo video to understand expected functionality and UX flow
- Explored the Figma files and prototypes to capture design specifications
- Used **ElevenLabs** to transcribe the video narration, ensuring I captured every detail mentioned verbally

I then fed the transcription into **Claude** to organize and structure a comprehensive feature checklist. This gave me a clear, prioritized list of requirements that served as my development roadmap.

> **Key Insight:** Investing time upfront in requirements gathering prevented scope creep and kept development focused.

### Phase 2: Rapid Prototyping

**Objective:** Validate understanding and experiment with features before committing to the final tech stack.

Using **Google AI Studio**, I created a functional prototype by:
- Providing the feature checklist as context
- Uploading Figma screenshots for visual reference
- Describing the desired interactions and user flows

This prototype (built with Vite + React) allowed me to:
- Test features in isolation
- Experiment with the UI/UX
- Identify potential edge cases
- Brainstorm additional improvements

> **Key Insight:** Prototyping revealed implementation details that weren't obvious from the requirements alone, such as handling category deletion with existing notes.

### Phase 3: Architecture & Implementation

**Objective:** Transform the validated prototype into a production-ready application using the required stack.

With a working prototype in hand, I transitioned to building the actual application:

1. **Backend First:** Set up Django REST Framework with:
   - Custom user model with JWT authentication
   - RESTful API endpoints for notes and categories
   - Special endpoints for bulk operations and smart deletion

2. **Frontend Migration:** Converted the React prototype to Next.js 14:
   - Implemented App Router architecture
   - Connected to the Django API
   - Added proper state management with React Context

**AI-Assisted Development (Vibe Coding):**

I strategically used different AI models based on task complexity:

| Task Type | Model Used | Rationale |
|-----------|------------|-----------|
| Core architecture & complex features | Claude Opus 4.5 | Superior reasoning for system design |
| Bug fixes & minor adjustments | Claude Sonnet / Gemini | Cost-effective for smaller tasks |
| Documentation & presentation content | Claude Sonnet | Excellent for structured writing |

Tools used: **Claude.ai** and **Cursor IDE** for pair programming with AI.

### Phase 4: Documentation & Presentation

**Objective:** Communicate the work effectively.

- Created this README documenting the development process
- Used **Claude Sonnet** to generate a structured application summary
- Built the final presentation using **Gamma** with the generated content

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Django 4.2 | Web framework |
| Django REST Framework | API development |
| Simple JWT | Authentication |
| SQLite | Database (dev) |
| django-cors-headers | Cross-origin requests |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Lucide React | Icons |

---

## ✨ Features

### Core Features
- **User Authentication:** Secure signup/login with JWT tokens
- **Note Management:** Create, edit, delete notes with auto-save
- **Category Organization:** Color-coded categories with customizable themes
- **Responsive Design:** Works seamlessly on desktop and mobile

### Advanced Features
- **Auto-Save:** Notes save automatically with debouncing (800ms delay)
- **Category Engine:** Full CRUD for categories with 7 color themes
- **Smart Deletion:** Options to delete category notes or move them first
- **Bulk Operations:** Move multiple notes between categories
- **Collapsible Sidebar:** Maximize workspace when needed

### UX Polish
- Charming pastel aesthetic with consistent design language
- Smooth animations and transitions
- Delete confirmation dialogs to prevent accidents
- Empty states with friendly illustrations

Here's a new section highlighting your overdelivery features:

---

## 🚀 Beyond the Requirements: Additional Features Implemented

While the challenge provided a clear set of requirements, I identified opportunities to enhance the user experience and demonstrate additional technical capabilities. The following features were implemented as **value-added improvements** beyond the original scope:

### Security & Usability Enhancements

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Flexible Password Policy** | Simplified password requirements for easier onboarding | Reduces friction for new users while maintaining security |
| **Delete Confirmation Dialogs** | Added confirmation modal before deleting notes | Prevents accidental data loss — a critical UX safeguard |

### Category Engine (Complete Category Management System)

I noticed the original requirements had basic category functionality, so I built a comprehensive **Category Engine** accessible via a settings icon in the sidebar:

| Feature | Implementation |
|---------|----------------|
| **Create New Categories** | Add unlimited custom categories on the fly |
| **Edit Category Names** | Inline editing with instant save |
| **Edit Category Colors** | 7 color theme options with visual picker |
| **Move Notes Between Categories** | Select specific notes and bulk-move to another category |
| **Smart Category Deletion** | Two options when deleting a category with notes: <br>• Move all notes to another category first, then delete <br>• Delete category and all notes inside |

> **Why this matters:** Users inevitably need to reorganize their notes. Without these features, they'd be stuck with their initial category structure forever — a significant limitation for any note-taking app.

### Enhanced Sidebar Experience

| Feature | Description |
|---------|-------------|
| **User Profile Display** | Shows the logged-in user's identity in the sidebar |
| **Logout Button** | Convenient sign-out accessible from any screen |
| **Collapsible Sidebar** | Toggle button to collapse/expand the sidebar, maximizing screen space for note content |

### Why I Built These

These additions weren't just about adding features — they reflect how I approach product development:

1. **User Empathy:** I asked myself "What would frustrate me as a user?" and addressed those pain points
2. **Completeness:** A category system without edit/delete capabilities feels incomplete
3. **Scalability:** As users accumulate notes, they need tools to reorganize — not just create
4. **Polish:** Small touches like delete confirmations and collapsible sidebars separate good apps from great ones

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Create new account |
| POST | `/api/auth/login/` | Login and get tokens |
| POST | `/api/auth/logout/` | Invalidate tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/user/` | Get current user |

### Notes Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/` | List all notes |
| POST | `/api/notes/` | Create note |
| GET | `/api/notes/{id}/` | Get note |
| PATCH | `/api/notes/{id}/` | Update note |
| DELETE | `/api/notes/{id}/` | Delete note |
| POST | `/api/notes/bulk_move/` | Move multiple notes |

### Categories Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List categories |
| POST | `/api/categories/` | Create category |
| PATCH | `/api/categories/{id}/` | Update category |
| DELETE | `/api/categories/{id}/` | Delete category |
| POST | `/api/categories/{id}/delete_with_notes/` | Delete with all notes |
| POST | `/api/categories/{id}/move_notes_and_delete/` | Move notes then delete |

---

## 🎨 Design System

### Color Palette

| Element | Color Code |
|---------|------------|
| Background | `#FBF7F0` |
| Text | `#4A3B2C` |
| Border | `#8B7355` |
| Input Background | `#F3EFE6` |
| Accent | `#F4EBD0` |

### Category Themes

| Theme | Background | Border |
|-------|------------|--------|
| Orange | `#F2B989` | `#C06626` |
| Yellow | `#F9E5A8` | `#D4AF37` |
| Green | `#C8D5B9` | `#788F63` |
| Teal | `#90B4B5` | `#4A7A7B` |
| Peach | `#F5CBA7` | `#D35400` |
| Blue | `#AED6F1` | `#2E86C1` |
| Pink | `#F5B7B1` | `#C0392B` |

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** DM Sans (sans-serif)

---

## 🔮 Future Improvements

If I had additional time, I would implement:

1. **Search Functionality:** Full-text search across notes
2. **Rich Text Editor:** Markdown support with preview
3. **Tags System:** Flexible tagging beyond categories
4. **Note Sharing:** Generate shareable links
5. **Dark Mode:** Toggle between light/dark themes
6. **Offline Support:** PWA with local caching
7. **Export Options:** Download notes as PDF/Markdown
8. **Keyboard Shortcuts:** Power user navigation

---

## 📝 Lessons Learned

1. **Prototype First:** Building a quick prototype saved significant time during implementation
2. **AI as a Tool:** Strategic use of different AI models optimized both quality and cost
3. **Requirements Matter:** Thorough upfront analysis prevented mid-project pivots
4. **Iterative Refinement:** Each phase built upon validated work from the previous phase

---

## 👤 Author

**João Bosco (JB) Mesquita**

---
