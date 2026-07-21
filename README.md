# 🎓 CFTRI & CUET Exam Prep Dashboard

A modern, high-performance personal exam preparation dashboard designed specifically for students preparing for the **CFTRI** (Central Food Technological Research Institute) and **CUET PG** entrance examinations.

Built with a clean SaaS aesthetic (Linear/Notion-inspired), rich dark mode support, real-time exam countdowns, interactive study schedule blocks, Pomodoro focus timer, subject progress tracking, habit trackers, and a dedicated notes vault.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher (`node -v`)
- **npm**: v9 or higher (`npm -v`)
- **MongoDB**: Optional local MongoDB daemon (`mongodb://127.0.0.1:27017`) or Atlas URI. *(Note: If local MongoDB is not running, the server automatically boots an embedded `MongoMemoryServer` so the app runs out-of-the-box with zero setup!)*

---

### ⚡ One-Click Batch Launcher (Windows)
Double-click the `start_app.bat` file in the root directory to automatically launch both the server and client simultaneously in separate terminal windows!

---

### 1. Start the Backend API Server (`/server`)

Open a terminal in the root directory:

```bash
cd server
npm install
npm start
```
> The server will start on **http://localhost:5000** and auto-seed initial exam dates, subjects, timeline milestones, and revision tasks.

---

### 2. Start the Frontend Application (`/client`)

Open a second terminal in the root directory:

```bash
cd client
npm install
npm run dev
```
> The React dashboard will launch on **http://localhost:3000** (or Vite allocated port) with API requests proxied to port 5000.

---

## 🎨 Core Features & Architecture

1. **Live Clock & Date Header**: Real-time HH:MM:SS clock updating every second with full date display and study streak counter.
2. **CFTRI & CUET Exam Countdowns**: Live updating days/hours/minutes/seconds countdown cards with editable target dates.
3. **Admission Timeline Stepper**: Visual milestone tracker for application deadlines, admit card releases, exams, and counselling slots.
4. **Interactive 3 PM – 8 PM Study Block**: Visual schedule highlighting active hourly slots, with a configurable half-hour break slot (e.g., 5:00 PM – 5:30 PM).
5. **Subject Progress & Syllabus Tracker**: Visual progress bars & sliders categorized for CFTRI and CUET entrance subjects with custom color tags.
6. **Weekly Study Hours Analytics**: Recharts stacked bar graph displaying daily study hours logged per subject across the current week.
7. **Daily Mock Test Habit Tracker**: Calendar grid for the current month allowing quick daily check-offs for completed mock tests.
8. **Study Streak Engine**: Auto-calculated consecutive active days (mock tests done or study hours logged) featuring current and longest streak records.
9. **Pomodoro Focus Timer**: SVG circular timer supporting 25m work / 5m short break / 15m long break cycles with Web Audio API synthesized chimes and auto-logging to study hours.
10. **Saturday Revision Planner**: Dedicated revision checklist highlighting on Saturdays (and accessible anytime) for managing study backlogs.
11. **Notes & File Vault**: Drag-and-drop file uploader (PDF, DOCX, images, TXT) saved on disk (`/server/uploads`) with subject tag metadata stored in MongoDB.
12. **Dark / Light Theme Toggle**: Persistent theme preference with curated high-contrast modern styling.

---

## 📂 Folder Structure

```
Dummy/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Dashboard Widgets & Cards
│   │   ├── context/            # Light/Dark Theme Context Provider
│   │   ├── services/           # Axios REST API Client
│   │   ├── App.jsx             # Main Application Layout & State Handler
│   │   └── index.css           # Tailwind Directives & CSS Tokens
│   ├── index.html
│   └── vite.config.js
├── server/                     # Express REST API Server
│   ├── models/                 # Mongoose Schemas (ExamSettings, Timeline, Subject, StudyLog, MockTest, RevisionTask, Note)
│   ├── routes/                 # API Endpoint Routes
│   ├── uploads/                # Local File Disk Storage
│   ├── utils/seedData.js       # Auto-Seeding Default Content
│   └── index.js                # Express App Initialization
└── README.md                   # Full Instructions
```

---

## 🛠️ API Routes Overview

- `GET /api/exams` | `PUT /api/exams` - Read & update target exam dates and break schedules
- `GET /api/timeline` | `POST /api/timeline` | `DELETE /api/timeline/:id` - Manage admission timeline milestones
- `GET /api/subjects` | `POST /api/subjects` | `PUT /api/subjects/:id` | `DELETE /api/subjects/:id` - Subject CRUD & progress
- `GET /api/study-log` | `POST /api/study-log` - Log daily study hours
- `GET /api/mock-tests` | `POST /api/mock-tests` - Daily mock test habit tracking
- `GET /api/streak` - Calculate active study streaks
- `GET /api/revision-tasks` | `POST /api/revision-tasks` | `PUT /api/revision-tasks/:id` - Saturday revision checklist
- `GET /api/notes` | `POST /api/notes/upload` | `GET /api/notes/:id/download` - Notes file management
