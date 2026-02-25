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
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {

  const { user, profile, signOut } = useAuth();
  const displayName = profile?.username || user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email;
  const navigate = useNavigate();
  const [ exercise, setExercise ] = useState({
    id: 1,
    name: 'Yoga',
    date: '25/02/2026',
    duration: '30 minutes',
    notes: 'Relaxing session focusing on flexibility and mindfulness.',
  });
  const [ selectedExercises, setSelectedExercises ] = useState([]);

  const fetchScheduledExercises = async () => {
    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false);       // <- only incomplete
    if (error) {
      console.error('Error fetching scheduled exercises:', error);
    } else {
      setSelectedExercises(data);
    }
  };
  useEffect(() => {
    if (user) {
      fetchScheduledExercises();
    } else {
      setSelectedExercises([]);
    }
  }, [user]);
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
  const fetchCompletedExercises = async () => {
    if (!user) return;  // ✅ guard

    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false });

    // TODO: setCompletedExercises(data) or similar
  };

  useEffect(() => {
    if (!user) return;  // ✅ don't call when user is null
    fetchCompletedExercises();
  }, [user]);

  const handleComplete = async (exerciseId) => {
    const { error } = await supabase
      .from('user_exercises')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', exerciseId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking exercise complete:', error);
      alert('Could not mark as complete. Please try again.');
      return;
    }

    // Remove from current list so it disappears from the home screen
    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
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
        <div key={exercise.id}>
          <h2 className='text-xl font-semibold mb-2 inline'><img src={dumbbell} alt="dumbbell" className='logo w-40 h-20 inline mr-2 sm:mr-4 xs:w-20 xs:h-10 sm:h-10 sm:w-15 lg:w-50 lg:h-20 md:w-40 md:h-20 lg:mr-6' />Scheduled Exercises</h2>
          <h4>Upcoming Workouts</h4>
          <div className='flex mx-auto'>
              <div className='flex-4 mt-3'>
                {selectedExercises.length > 0 ? (
                  selectedExercises.map((ex) => (
                    <div key={ex.id} className='p-4 bg-black-100 rounded-lg shadow-sm mb-4 flex'>
                      <div className='p-4 bg-gray-100 rounded-lg shadow-sm mb-4 flex-4'>
                        <h3 className='text-lg font-semibold'>{ex.name}</h3>
                        <p className='text-gray-700'>Category: {ex.category}</p>
                        <p className='text-gray-700'>Duration: {ex.duration}</p>
                        <p className='text-gray-700'>Muscles: {ex.muscles}</p>

                        {Array.isArray(ex.images) && ex.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 object-cover lg:grid-cols-4 lg:gap-6 sm:gap-4 xs:grid-cols-1">
                            {ex.images.slice(0, 2).map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={ex.name}
                                className="w-full h-48 object-cover rounded-md mb-2"
                              />
                            ))}
                          </div>
                        )}

                        <span className='text-red-500'>For more details search the exercise</span>
                      </div>
                      <div className='flex-1 gap-2 mt-5 justify-end flex'>
                        <div>
                        <input type="checkbox" className="w-4 h-4 flex-initial text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-green-500" />
                        </div>
                        <div>
                        <button className='bg-green-500 flex-initial text-white px-4 py-2 rounded hover:bg-green-600 p-2'
                          onClick={() => handleComplete(ex.id)}
                        >
                          Complete
                        </button>
                        </div>
                      </div>

                      
                    </div>
                    
                  ))
                ) : (
                  <p className='text-gray-700'>No workouts scheduled yet. Start by adding a workout to your profile!</p>
                )}
              </div>
          </div>
        </div>
        <div className='mt-6 flex gap-4 justify-end mb-1.5'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600' onClick={() => navigate('/add-exercise')} >+ Add Exercise</button>
          <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2'>Start Workout</button>
        </div>
        <div>
          <h4>My Saved Exercises</h4>
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
          <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600' onClick={() => navigate('/add-exercise')} >+ Add Exercise</button>
        </div>
        <div>
          <h4>Previous Workouts</h4>
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
              <p className='text-gray-700'>No previous workouts found. Check back later!</p>
            )}
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