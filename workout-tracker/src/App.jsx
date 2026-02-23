import { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './components/profile.jsx';
import SignUp from './components/signUp.jsx';


function App() {
  const { isLoading, error } = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}

export default App