# Workout Tracker

A modern, responsive web application for tracking and managing your fitness workouts. Built with React, Vite, Tailwind CSS, and Supabase authentication.

## 🎯 Features

- **User Authentication**: Email/password signup and username-based login powered by Supabase
- **Exercise Library**: Browse exercises from the WGER public API with images, muscles, categories, and pagination
- **Search & Results**: Global search and results tabs for WGER, My Saved, and Info
- **Home Dashboard**: Scheduled workouts, saved exercises, and previous workouts dropdown
- **Workout Session**: Log duration, reps, and priority; mark scheduled exercises completed
- **Profile & Activity**: Completed activities dropdown, recent activity dropdown, and preferred categories
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Fast Performance**: Vite-powered builds and HMR

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0 with Hooks
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Code Quality**: ESLint 9.39.1

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd capstone-project/workout-tracker
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## 📄 License

This project is part of a capstone initiative.
