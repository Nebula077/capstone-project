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
  const [ completedExercises, setCompletedExercises ] = useState([]);
  const [ completedSavedExercises, setCompletedSavedExercises ] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [showAllPrevious, setShowAllPrevious] = useState(false);
  const [expandedPrevious, setExpandedPrevious] = useState(new Set());

  const fetchScheduledExercises = async () => {
    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false);       
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
    if (!user) return; 

    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching completed exercises:', error);
    } else {
      setCompletedExercises(data);
      setUserActivity(data);  
    }
  };

  useEffect(() => {
    if (!user) return; 
    fetchCompletedExercises();
  }, [user]);

  const handleCompleteSavedExercise = async (exerciseId) => {
    const { error } = await supabase
      .from('exercises')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', exerciseId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking exercise complete:', error);
      alert('Could not mark as complete. Please try again.');
      return;
    }
    setCreatedExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  };
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

  const togglePreviousExpand = (exerciseId) => {
    setExpandedPrevious(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
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
          <div className='flex mx-auto p-4 bg-white rounded-lg shadow-md mb-4 border-l-4 border-blue-500'>
              <div className='flex-4 mt-3 mr-4'>
                {selectedExercises.length > 0 ? (
                  selectedExercises.map((ex) => (
                    <div key={ex.id} className='p-4 rounded-lg shadow-sm mb-4 flex'>
                      <div className='p-4 bg-slate-100 rounded-lg shadow-sm mb-4 flex-4'>
                        <h3 className='text-lg font-semibold'>{ex.name}</h3>
                        <p className='text-gray-700'>Category: {ex.category}</p>
                        <p className='text-gray-700'>Duration: {ex.duration}</p>
                        <p className='text-gray-700'>Muscles: {ex.muscles}</p>

                        {Array.isArray(ex.images) && ex.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 object-cover lg:grid-cols-4 lg:gap-6 sm:gap-4 xs:grid-cols-1">
                            {ex.images.slice(0, 2).map((url, idx) => {
                              const secureUrl = url.startsWith('http')
                                ? url.replace('http://', 'https://')
                                : `https://wger.de${url}`;
                              return (
                                <img
                                  key={idx}
                                  src={secureUrl}
                                  alt={ex.name}
                                  className="w-full h-48 object-cover rounded-md mb-2"
                                />
                              );
                            })}
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
          <button className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2' onClick={() => navigate('/workout')}>Start Workout</button>
        </div>
        <div>
          <h4>My Saved Exercises</h4>
          <div>
            {createdExercises.length > 0 ? (
              createdExercises.map((ex) => (
                <div key={ex.id} className='flex mx-auto p-4 bg-white rounded-lg shadow-md mb-4 border-l-4 border-blue-500'>
                <div className='flex-4 p-4 bg-slate-100 rounded-lg shadow-md mb-4 border-l-4 border-blue-500'>
                  <h3 className='text-lg font-semibold'>{ex.name}</h3>
                  <p className='text-gray-700'>Description: {ex.description}</p>
                  <p className='text-gray-700'>Category: {ex.category}</p>
                  
                  {Array.isArray(ex.images) && ex.images.length > 0 && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 object-cover lg:grid-cols-4 lg:gap-6 sm:gap-4 xs:grid-cols-1">
                      {ex.images.slice(0, 4).map((url, idx) => {
                        // Handle both relative paths and full URLs
                        const fullUrl = url.startsWith('http') 
                          ? url.replace('http://', 'https://') 
                          : `https://wger.de${url}`;
                        return (
                          <img
                            key={idx}
                            src={fullUrl}
                            alt={ex.name}
                            className="w-full h-48 object-cover rounded-md mb-2"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className='flex-1 mt-2 p-4'>
                  <button 
                    className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                    onClick={() => handleCompleteSavedExercise(ex.id)}
                  >
                    Mark Complete
                  </button>
                </div>
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
        <div className='mt-6 p-4 bg-purple-300 rounded-lg shadow-md text-white'>
          <h4 className='text-xl font-semibold mb-4 text-center'>Previous Workouts</h4>
          {completedExercises.length === 0 ? (
            <p className='text-center text-sm'>No previous workouts found. Check back later!</p>
          ) : (
            <div className='space-y-4'>
              {/* Summary Stats */}
              <div className='bg-purple-400 rounded-lg p-4 text-center'>
                <p className='text-sm opacity-90'>Total Completed</p>
                <p className='text-2xl font-bold'>{completedExercises.length}</p>
              </div>

              {/* Dropdown List */}
              <div className='space-y-2'>
                {completedExercises.slice(0, showAllPrevious ? completedExercises.length : 2).map((ex) => (
                  <div key={ex.id} className='bg-purple-400 rounded-lg overflow-hidden'>
                    <button
                      onClick={() => togglePreviousExpand(ex.id)}
                      className='w-full px-4 py-3 flex justify-between items-center hover:bg-purple-500 transition-colors'
                    >
                      <span className='font-semibold text-left'>{ex.name}</span>
                      <span className='text-sm'>
                        {expandedPrevious.has(ex.id) ? '▼' : '▶'}
                      </span>
                    </button>
                    {expandedPrevious.has(ex.id) && (
                      <div className='px-4 py-3 bg-purple-500 border-t border-purple-300 space-y-2 text-sm'>
                        {ex.category && (
                          <p><span className='font-semibold'>Category:</span> {ex.category}</p>
                        )}
                        {ex.duration && (
                          <p><span className='font-semibold'>Duration:</span> {ex.duration}</p>
                        )}
                        {ex.muscles && (
                          <p><span className='font-semibold'>Muscles:</span> {ex.muscles}</p>
                        )}
                        {ex.completed_at && (
                          <p><span className='font-semibold'>Completed:</span> {new Date(ex.completed_at).toLocaleDateString()}</p>
                        )}
                        
                        {Array.isArray(ex.images) && ex.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ex.images.slice(0, 2).map((url, idx) => {
                              const fullUrl = url.startsWith('http') 
                                ? url.replace('http://', 'https://') 
                                : `https://wger.de${url}`;
                              return (
                                <img
                                  key={idx}
                                  src={fullUrl}
                                  alt={ex.name}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show More/Less Button */}
              {completedExercises.length > 2 && (
                <button
                  onClick={() => setShowAllPrevious(!showAllPrevious)}
                  className='w-full px-4 py-2 bg-purple-400 hover:bg-purple-500 rounded-lg font-semibold transition-colors'
                >
                  {showAllPrevious ? 'Show Less' : `Show More (${completedExercises.length - 2} more)`}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
      <div>
        < Footer />
      </div>
    </div>
  )
}

export default HomePage