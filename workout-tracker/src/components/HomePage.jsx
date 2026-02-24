import React from 'react'
import NavBar from './NavBar';
import { useAuth } from '../context/AuthContext.jsx';
import dumbbell from '../assets/dumbbell.png';
import { useState } from 'react';
import { useEffect } from 'react';
import AddExercise from './AddExercise.jsx';
import Footer from './Footer.jsx';
import Exercises from './Exercises.jsx';
import supabase from '../../supabase-client';

function HomePage() {

  const { user, profile, signOut } = useAuth();
  const displayName = profile?.username || user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email;
  const [ exercise, setExercise ] = useState({
    id: 1,
    name: 'Yoga',
    date: '25/02/2026',
    duration: '30 minutes',
    notes: 'Relaxing session focusing on flexibility and mindfulness.',
  });
  const [ createdExercises, setCreatedExercises ] = useState([]);

  useEffect(() => {
    if (!user) {
      setCreatedExercises([]);
      return;
    }
    fetchSavedExercises();
  }, [user]);

  const fetchSavedExercises = async () => {
    const { data, error } = await supabase.from('exercises')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      console.error('Error fetching saved exercises:', error);
    } else {
      setCreatedExercises(data);
    }
  };
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <NavBar />
      <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Workout Tracker</h1>
      <p className="text-gray-700">Track your workouts and stay fit!</p>
      {user && (
        <div className="mt-4">
          <p className="text-gray-700">Logged in as: {displayName}</p>
          <button onClick={signOut} className="mt-2 bg-red-500 text-red-100 px-4 py-2 rounded hover:bg-red-600">
            Sign Out
          </button>
        </div>
      )}
      </div>
      <div className='mt-6 p-4 bg-white rounded-lg shadow-md'>
        <div>
          <h2 className='text-xl font-semibold mb-2 inline'><img src={dumbbell} alt="dumbbell" className='logo w-40 h-20 inline mr-2 sm:mr-4 xs:w-20 xs:h-10 sm:h-10 sm:w-15 lg:w-50 lg:h-20 md:w-40 md:h-20 lg:mr-6' />Scheduled Exercises</h2>
          <h4>Upcoming Workouts</h4>
          <div className='mt-2 sm:mt-4 lg:mt-6 xs:flex-col xs:gap-4 sm:flex-row sm:items-center gap-6'>
            {exercise ? (
              <div className='flex justify-between items-center gap-4 flex-col sm:flex-row'>
                <div className='p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col gap-2 w-80 sm:w-96 xs:w-50'>
                  <h3 className='text-lg font-semibold'>{exercise.name}</h3>
                  <p className='text-gray-700'>Duration: {exercise.duration}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <input type="checkbox" className="w-4 h-4 text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500" />
                  <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>Complete</button>
                </div>
              </div>
            ) : (
              <p className='text-gray-700'>No workouts scheduled yet. Start by adding a workout to your profile!</p>
            )}
          </div>
        </div>
        <div className='mt-6 flex gap-4 justify-end mb-1.5'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>+ Add Exercise</button>
          <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2'>Start Workout</button>
        </div>
        <div>
          <h4>Saved Exercises</h4>
          <div>
            {createdExercises.length > 0 ? (
              createdExercises.map((ex) => (
                <div key={ex.id} className='p-4 bg-gray-100 rounded-lg shadow-sm mb-4'>
                  <h3 className='text-lg font-semibold'>{ex.name}</h3>
                  <p className='text-gray-700'>Description: {ex.description}</p>
                  <p className='text-gray-700'>Category: {ex.category}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-700'>No saved exercises found. Start by adding a workout to your profile!</p>
            )}
          </div>
        </div>
        <div className='mt-6 flex gap-4 justify-end mb-1.5'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>+ Add Exercise</button>
        </div>
        <div>
          <h4>Previous Workouts</h4>
          <div>
            <p className='text-gray-700'>No previous workouts found. Check back later!</p>
          </div>
        </div>

      </div>
      <div>
        < Footer />
      </div>
    </div>
  )
}

export default HomePage