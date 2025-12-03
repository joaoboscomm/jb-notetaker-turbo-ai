
# JB's Note Taker - Full Stack (Django + Next.js)

This project has been fully converted to a production-ready architecture.

## 1. Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

## 2. Setup Backend (Django)

1.  Navigate to the `backend` folder.
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run migrations:
    ```bash
    python manage.py makemigrations api
    python manage.py migrate
    ```
5.  Start the server:
    ```bash
    python manage.py runserver
    ```
    The API will be available at `http://localhost:8000/api/`.

## 3. Setup Frontend (Next.js)

1.  Navigate to the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:3000` in your browser.

## 4. Usage

1.  Go to the login page.
2.  Enter an email/password to **Sign Up** (first time) or **Login**.
3.  The frontend will communicate with the Django backend to store your notes and categories in the SQLite database (`db.sqlite3`).
