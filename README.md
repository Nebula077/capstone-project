# Workout Tracker

A modern, responsive web application for tracking and managing your fitness workouts. Built with React, Vite, Tailwind CSS, and Supabase authentication.

## 🎯 Features

- **User Authentication**: Email/password signup and username-based login powered by Supabase (profiles stored in a `profiles` table with username, full name, and bio)
- **Exercise Library**: Browse exercises from the WGER public API with images, muscles, categories, and pagination (25 per page)
- **Search & Results**:
	- Global search from the navbar
	- Results page with three tabs: **WGER**, **My Saved**, and **Info** (Wikipedia summary like "push up exercise")
- **Workout Management**:
	- Save WGER exercises (including images and muscles) to a `user_exercises` table
	- Scheduled/Upcoming workouts shown on the Home page with basic details and thumbnails
	- Mark workouts as completed (tracked with `completed` and `completed_at`)
- **Profile & Editing**:
	- Profile page showing username, email, and saved exercises
	- Edit Profile form to update username, full name, and bio
	- Completed activities carousel showing previously completed workouts
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Fast Performance**: Built with Vite for lightning-fast development and production builds
- **Modern Styling**: Tailwind CSS and CoreUI for clean, utility-first styling

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0 with Hooks
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (email/password + username login)
- **Code Quality**: ESLint 9.39.1
- **Development**: React Fast Refresh (Hot Module Replacement)

## 📁 Project Structure

```
workout-tracker/
├── src/
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   ├── assets/              # Static assets
│   └── components/
│       ├── NavBar.jsx        # Navigation bar with global search and profile link
│       ├── HomePage.jsx      # Landing page, upcoming workouts, saved and previous workouts
│       ├── Exercises.jsx     # WGER exercise library with pagination and save-to-Supabase
│       ├── Results.jsx       # Search results (WGER, My Saved, Info/Wikipedia)
│       ├── signUp.jsx        # Supabase signup (email/password + username, full name, bio)
│       ├── loginPage.jsx     # Username + password login (username resolved to email)
│       ├── Profile.jsx       # User profile, completed activities carousel, saved exercises
│       └── EditProfile.jsx   # Edit profile form (username, full name, bio)
│
│   └── utils/
│       └── saveUserExercise.js # Shared helper to persist WGER exercises into user_exercises
├── public/                  # Static files
├── index.html               # HTML entry point
├── package.json             # Dependencies & scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint rules
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd capstone-project/workout-tracker
```

2. Install dependencies
```bash
npm install
```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application for production:

```bash
npm run build
```

The optimized files will be generated in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

### Code Quality

Check code quality with ESLint:

```bash
npm run lint
```

## 📋 Component Architecture

This project uses functional components with React Hooks:

- **State Management**: Local component state with `useState()`
- **Side Effects**: `useEffect()` for data fetching and side effects
- **Auth Context**: `AuthContext` provides Supabase session, profile (username), and auth helpers
- **Props-based Communication**: Simple unidirectional data flow

## 🔐 Authentication & Data

The app uses Supabase for both authentication and data storage:

- **Auth**:
	- Signup with email, password, username, full name, and optional bio
	- Login with username + password (Supabase resolves username → email via `profiles`)
	- Profile view shows username/email and allows sign out

- **Database Tables (core)**:
	- `profiles`: `id`, `email`, `username`, `full_name`, `bio`
	- `user_exercises`: `user_id`, `exercise_id`, `name`, `category`, `description`, `images` (JSON array of URLs), `muscles` (JSON array), `completed`, `completed_at`
	- `exercises`: custom exercises created by the user (used on Home/Profile)

Environment variables (set in `.env.local`):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## 📝 Development Guidelines

- Use **functional components** with Hooks only
- Keep components **small and focused** (single responsibility)
- Style with **Tailwind CSS** or scoped CSS modules
- Follow **ESLint rules** for code quality
- Maintain **HMR-friendly** code patterns
- Use **named exports** for components

## 🤝 Contributing

When contributing to this project:

1. Create a feature branch from `main`
2. Make your changes following the development guidelines
3. Test your changes locally
4. Run `npm run lint` to check code quality
5. Run `npm run build` to verify production build
6. Submit a pull request with a clear description

## 📦 Environment Setup

The project uses Vite for environment variable management. Access environment variables via `import.meta.env.VITE_*`

Create a `.env.local` file in the project root for local development:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## 📄 License

This project is part of a capstone initiative.

## 📧 Support

For questions or issues, please open an issue in the repository.
