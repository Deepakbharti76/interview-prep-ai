# Interview Prep AI

A full-stack MERN application that generates AI-powered interview questions and answers based on your job role, experience, and topics — built with React, Node.js, Express, MongoDB, and Google Gemini AI. Includes a complete Admin Panel for managing users, sessions, and analytics.

---

## ✨ Features

- 🔐 JWT-based authentication (signup/login)
- 🧠 AI-generated interview questions using Google Gemini
- 📌 Pin important questions
- 💡 AI concept explanations
- 🗑️ Create & delete interview sessions
- 🛡️ **Admin Panel**
  - Dashboard with key stats (users, sessions, questions, active users)
  - User management (view, delete, block/unblock, promote to admin)
  - Session management (view, delete)
  - Analytics with charts (daily registrations, weekly sessions, popular roles)

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Axios, Framer Motion, React Hot Toast, React Icons, Recharts
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, bcryptjs
**AI:** Google Gemini API (`@google/genai`)

---

## 📁 Project Structure

```
interview-prep-ai/
├── backend/
│   ├── config/          # Database connection
│   ├── controller/       # Route logic (auth, session, ai, admin)
│   ├── middlewares/      # JWT auth + admin role guard
│   ├── models/           # Mongoose schemas (User, Session, Question)
│   ├── routes/           # API route definitions
│   ├── scripts/          # CLI helper to create your first admin
│   ├── .env               # ⚠️ NOT in GitHub (see below)
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI + admin/ components
│   │   ├── pages/         # App pages + admin/ pages
│   │   └── utils/         # Axios instance, API paths
│   └── .env               # ⚠️ NOT in GitHub if created (see below)
└── README.md
```

---

## 🚀 Setup & Installation

### 1. Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file (this file is git-ignored, see below):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend:

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

(Optional) If your backend isn't on `localhost:5000`, create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Create your first Admin account

Sign up normally through the app (this creates a regular `user` account), then run:

```bash
cd backend
node scripts/make-admin.js your-email@example.com
```

This promotes that account to `admin`. Log in again, and you'll see an **Admin Panel** link in the navbar.

---

## 🔒 Files NOT to push to GitHub

These files contain secrets or machine-specific junk and must never be committed. They are already excluded via the **root `.gitignore`** — you don't need to do anything extra, just don't force-add them.

| File / Folder                             | Why it's excluded                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `backend/.env`                            | Contains your MongoDB URI, JWT secret, and Gemini API key — exposing this lets anyone access your database and AI quota. |
| `frontend/.env`                           | May contain your backend URL; not sensitive but still environment-specific.                                              |
| `node_modules/` (both frontend & backend) | Huge, regenerated via `npm install` — never commit it.                                                                   |
| `dist/` / `build/`                        | Build output, regenerated automatically.                                                                                 |
| `.vscode/`                                | Personal editor settings, not project config.                                                                            |
| `*.log`, `npm-debug.log*`                 | Local debug logs, useless to others.                                                                                     |
| `.DS_Store`, `Thumbs.db`                  | OS-generated junk files (Mac/Windows).                                                                                   |

### Where this is configured

It's already set up at the **project root**: `interview-prep-ai/.gitignore`. This single file applies to the whole repo (both `backend/` and `frontend/`), so you don't need a separate `.gitignore` inside each folder.

Current contents:

```gitignore
# Dependencies
node_modules/

# Environment variables (IMPORTANT)
.env
backend/.env
frontend/.env

# Build files
dist/
build/

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
Thumbs.db

# VS Code settings
.vscode/
```

> ⚠️ **Important:** If you already pushed `.env` to GitHub before adding `.gitignore`, adding the rule now won't remove it from history. You'd need to run `git rm --cached backend/.env` once, commit, and ideally rotate (change) your JWT secret and Gemini API key since they were exposed.

### What you SHOULD push

Everything else — all source code (`backend/controller`, `backend/models`, `backend/routes`, `frontend/src`, etc.), `package.json`, `package-lock.json`, and this `README.md`. A teammate or recruiter cloning your repo should be able to run `npm install` in both folders, add their own `.env`, and get the project running.

---

## 📡 API Overview

| Method | Route                          | Description                |
| ------ | ------------------------------ | -------------------------- |
| POST   | `/api/auth/signup`             | Register a new user        |
| POST   | `/api/auth/login`              | Login                      |
| POST   | `/api/sessions/create`         | Create interview session   |
| GET    | `/api/sessions/my-sessions`    | Get user's sessions        |
| GET    | `/api/sessions/:id`            | Get one session            |
| DELETE | `/api/sessions/:id`            | Delete a session           |
| POST   | `/api/ai/generate`             | Generate AI questions      |
| POST   | `/api/ai/explain`              | Get AI concept explanation |
| PATCH  | `/api/questions/pin/:id`       | Pin/unpin a question       |
| GET    | `/api/admin/dashboard`         | Admin dashboard stats      |
| GET    | `/api/admin/users`             | List all users             |
| DELETE | `/api/admin/users/:id`         | Delete a user              |
| PATCH  | `/api/admin/users/:id/block`   | Block/unblock a user       |
| PATCH  | `/api/admin/users/:id/promote` | Promote user to admin      |
| GET    | `/api/admin/sessions`          | List all sessions          |
| DELETE | `/api/admin/sessions/:id`      | Delete a session (admin)   |
| GET    | `/api/admin/analytics`         | Analytics data             |

All `/api/admin/*` routes require a valid JWT **and** `role: "admin"`.

---

## 📝 License

This project was built for educational purposes as part of a coding session.
