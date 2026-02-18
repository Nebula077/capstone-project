import { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginPage.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import ProfilePage from './components/profile.jsx';

function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App