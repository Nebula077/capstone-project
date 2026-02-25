import './App.css';
import HomePage from './components/HomePage.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './components/profile.jsx';
import SignUp from './components/signUp.jsx';
import LoginPage from './components/loginPage.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AddExercise from './components/AddExercise.jsx';
import Exercises from './components/Exercises.jsx';
import Results from './components/Results.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-exercise" element={<AddExercise />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;