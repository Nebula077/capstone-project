import { useState } from 'react'
import './App.css'
import LoginButton from './components/loginButton.jsx';
import LogoutButton from './components/logoutButton.jsx';
import React from 'react';
import Profile from './components/profile.jsx';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Workout Tracker</h1>
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

export default App