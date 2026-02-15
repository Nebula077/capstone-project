# Workout Tracker

A modern, responsive web application for tracking and managing your fitness workouts. Built with React, Vite, and Tailwind CSS.

## 🎯 Features

- **User Authentication**: Secure login/logout with Auth0 integration
- **Workout Management**: Create, view, and track your workouts
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Fast Performance**: Built with Vite for lightning-fast development and production builds
- **Modern Styling**: Tailwind CSS for clean, utility-first styling

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0 with Hooks
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
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
│       ├── loginButton.jsx   # Auth0 login button
│       ├── logoutButton.jsx  # Auth0 logout button
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
- **Props-based Communication**: Simple unidirectional data flow
- **No Global State Library**: Uses props drilling for simplicity (can be refactored with Context API if needed)

## 🔐 Authentication

The app uses Auth0 for secure user authentication. Features include:

- Login via `loginButton` component
- Logout via `logoutButton` component
- User profile access via `Profile` component

Configure your Auth0 credentials in the environment variables before running the app.

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
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
```

## 📄 License

This project is part of a capstone initiative.

## 📧 Support

For questions or issues, please open an issue in the repository.
