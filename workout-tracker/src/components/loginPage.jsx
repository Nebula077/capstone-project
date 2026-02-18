import LoginButton from './loginButton.jsx';
import LogoutButton from './logoutButton.jsx';
import React from 'react';
import Profile from './profile.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import NavBar from './NavBar.jsx';
import HomePage from './HomePage.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function LoginPage() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-gray-100">
        <NavBar />
        <h1 className='text-red-500 mx-auto'>Workout Tracker</h1>
        {error && <p>Authentication error</p>}
        {!error && isLoading && <p>Loading...</p>}
        {!error && !isLoading &&
        <> 
          <LoginButton />
          <LogoutButton />
          <Profile />
        </>
        }
      </div>
    </>
  )
}

export default LoginPage