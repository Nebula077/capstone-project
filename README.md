# Workout Tracker

A modern, responsive web application for tracking and managing your fitness workouts. Built with React, Vite, Tailwind CSS, and Supabase authentication.

## 🎯 Features

- **User Authentication**: Email/password signup and username-based login powered by Supabase
- **Workout Management**: Create, view, and track your workouts
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Fast Performance**: Built with Vite for lightning-fast development and production builds
- **Modern Styling**: Tailwind CSS for clean, utility-first styling

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
│       ├── NavBar.jsx        # Navigation bar
│       ├── HomePage.jsx      # Landing page
│       ├── signUp.jsx        # Supabase signup (email/password + username)
│       ├── loginPage.jsx     # Username + password login
│       └── Profile.jsx       # User profile component
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

## 🔐 Authentication

The app uses Supabase Auth:

- Signup with email, password, and a username (stored in a `profiles` table)
- Login with username + password (resolved to email behind the scenes)
- Profile view shows username/email and allows sign out

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
