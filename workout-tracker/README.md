# Workout Tracker

A modern, responsive web application for tracking and managing your fitness workouts. Built with React, Vite, Tailwind CSS, Supabase, and TanStack Query (React Query) for efficient data fetching and caching.

## 🎯 Features

### 🔐 User Authentication

- Email/password signup and username-based login
- Powered by Supabase Auth
- Protected routes and user profile management

### 💪 Exercise Library

- Browse 1000+ exercises from the WGER public API
- Detailed exercise information (muscles, categories, equipment)
- High-quality images and video demonstrations
- Pagination support (25 exercises per page)
- Search functionality across exercise database

### 🏠 Home Dashboard

- **Scheduled Workouts**: View and manage upcoming exercises
- **Saved Exercises**: Your custom exercise collection
- **Previous Workouts**: Collapsible history with completion dates
- Quick actions: Add exercises, start workout sessions
- Real-time data updates with optimistic UI

### 🏋️ Workout Session

- Log exercise duration, repetitions, and priority
- Mark exercises as completed
- Track workout history
- Completion timestamps

### 👤 Profile & Activity

- User profile management
- Completed activities with dropdown view
- Recent activity tracking
- Preferred exercise categories

### 🚀 Performance & UX

- **React Query Integration**: Intelligent data caching and background refetching
- **Optimistic Updates**: Instant UI feedback for better user experience
- **Loading States**: Skeleton loaders for smooth transitions
- **Error Handling**: Graceful error states with user-friendly messages
- **Fast Performance**: Vite-powered builds with Hot Module Replacement (HMR)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend

- **React 19.2.0** - Component-based UI with Hooks
- **Vite 7.2.4** - Next-generation frontend build tool
- **TanStack Query 5.90.21** - Powerful data synchronization and caching
- **React Router 7.13.0** - Client-side routing and navigation
- **Tailwind CSS 4.2.0** - Utility-first CSS framework
- **CoreUI React 5.9.2** - UI component library

### Backend & Data

- **Supabase** - Backend-as-a-Service (authentication and database)
- **Axios 1.13.5** - HTTP client for API requests
- **WGER API** - Exercise database integration

### Form & Validation

- **Formik 2.4.9** - Form state management
- **Yup 1.7.1** - Schema validation

### State Management

- **Zustand 5.0.11** - Lightweight state management
- **TanStack Query** - Server state management and caching

### Code Quality

- **ESLint 9.39.1** - Linting and code quality
- **React Hooks ESLint Plugin** - Hooks-specific linting rules

## 📂 Project Structure

```
workout-tracker/
├── src/
│   ├── components/
│   │   ├── HomePage.jsx         # Main dashboard with workouts
│   │   ├── Exercises.jsx        # Exercise library browser
│   │   ├── NavBar.jsx           # Navigation component
│   │   ├── Profile.jsx          # User profile page
│   │   ├── Workout.jsx          # Workout session tracker
│   │   ├── AddExercise.jsx      # Add new exercises
│   │   ├── Results.jsx          # Search results page
│   │   ├── loginPage.jsx        # Login page
│   │   ├── signUp.jsx           # Sign up page
│   │   └── Footer.jsx           # Footer component
│   ├── context/
│   │   ├── AuthContext.jsx      # Authentication context
│   │   └── LoadingSkeleton.jsx  # Loading state component
│   ├── services/
│   │   └── api.js               # API integration layer
│   ├── utils/
│   │   └── saveUserExercise.js  # Exercise saving utility
│   ├── assets/                  # Static images
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point with providers
│   └── index.css                # Global styles
├── supabase-client.js           # Supabase configuration
├── database-setup.sql           # Database schema
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (for authentication and database)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd capstone-project/workout-tracker
```

2; Install dependencies:

```bash
npm install
```

3; Set up environment variables (see below)

4; Run the database setup script in your Supabase SQL editor

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Lint

Check code quality:

```bash
npm run lint
```

## 🔐 Environment Variables

Create a `.env.local` file in the `workout-tracker` root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# WGER API (Optional - defaults to public API)
VITE_WGER_API_BASE_URL=https://wger.de/api/v2/
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy the Project URL and anon/public key
4. Paste them into your `.env.local` file

## 🗄️ Database Setup

The application requires the following Supabase tables:

- **users** - User profiles (managed by Supabase Auth)
- **exercises** - Custom user-created exercises
- **user_exercises** - Scheduled and completed exercises

Run the `database-setup.sql` script in your Supabase SQL editor to create the necessary tables and relationships.

## 🔧 Key Features Implementation

### React Query Integration

All data fetching uses TanStack Query for:

- **Automatic caching** - Reduces unnecessary API calls
- **Background refetching** - Keeps data fresh
- **Optimistic updates** - Instant UI feedback
- **Error retry logic** - Automatic retry on failure
- **Loading states** - Built-in loading indicators

### API Integration

**WGER Exercise API:**

- Public API with 1000+ exercises
- Exercise details, images, videos, and categories
- No authentication required

**Supabase:**

- User authentication and authorization
- Real-time database operations
- Row-level security

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

This is a capstone project. For questions or suggestions, please open an issue.

## 📄 License

This project is part of a capstone initiative.
