import React from 'react'
import NavBar from './NavBar';

function HomePage() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Welcome to Workout Tracker</h1>
      <p className="text-gray-700">Track your workouts and stay fit!</p>
    </div>
  )
}

export default HomePage