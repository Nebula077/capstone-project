import NavBar from './NavBar';
import { useAuth } from '../context/AuthContext.jsx';
import dumbbell from '../assets/dumbbell.png';
import { useState } from 'react';
import Footer from './Footer.jsx';
import supabase from '../../supabase-client';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function HomePage() {

  const { user, profile, signOut } = useAuth();
  const displayName = profile?.username || user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ showAllPrevious, setShowAllPrevious] = useState(false);
  const [ expandedPrevious, setExpandedPrevious] = useState(new Set());
  const [exercise, setExercise] = useState({
    name: '',
    category: '',
    description: '',
  });

  const fetchScheduledExercises = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false);       
    if (error) throw error;
    return data || [];
  };

  const fetchSavedExercises = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', user.id);
    if (error) throw error;
    return data || [];
  };

  const fetchCompletedExercises = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('completed_at', { ascending: false });
    if (error) throw error;
    return data || [];
  };

  const { 
    data: selectedExercises = [], 
    isLoading: scheduledLoading, 
    error: scheduledError 
  } = useQuery({
    queryKey: ['scheduledExercises', user?.id],
    queryFn: fetchScheduledExercises,
    enabled: !!user,
  });

  const { 
    data: createdExercises = [], 
    isLoading: savedLoading, 
    error: savedError 
  } = useQuery({
    queryKey: ['savedExercises', user?.id],
    queryFn: fetchSavedExercises,
    enabled: !!user,
  });

  const { 
    data: completedExercises = [], 
    isLoading: completedLoading, 
    error: completedError 
  } = useQuery({
    queryKey: ['completedExercises', user?.id],
    queryFn: fetchCompletedExercises,
    enabled: !!user,
  });
  
  const completeSavedExerciseMutation = useMutation({
    mutationFn: async (exerciseId) => {
      const { error } = await supabase
        .from('exercises')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', exerciseId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['savedExercises', user?.id]);
      queryClient.invalidateQueries(['completedExercises', user?.id]);
    },
    onError: (error) => {
      console.error('Error marking exercise complete:', error);
      alert('Could not mark as complete. Please try again.');
    },
  });

  const completeScheduledExerciseMutation = useMutation({
    mutationFn: async (exerciseId) => {
      const { error } = await supabase
        .from('user_exercises')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', exerciseId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledExercises', user?.id]);
      queryClient.invalidateQueries(['completedExercises', user?.id]);
    },
    onError: (error) => {
      console.error('Error marking exercise complete:', error);
      alert('Could not mark as complete. Please try again.');
    },
  });

  const handleCompleteSavedExercise = (exerciseId) => {
    completeSavedExerciseMutation.mutate(exerciseId);
  };

  const handleComplete = (exerciseId) => {
    completeScheduledExerciseMutation.mutate(exerciseId);
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

  if (scheduledLoading || savedLoading || completedLoading) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen min-w-full">
        <NavBar />
        <div className="flex items-center justify-center mt-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your workout data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (scheduledError || savedError || completedError) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen min-w-full">
        <NavBar />
        <div className="mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error loading data</p>
          <p>{scheduledError?.message || savedError?.message || completedError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen relative font-serif">
      <NavBar />
      <div>
      <h1 className="text-2xl font-bold mb-2 font-mono">Welcome to Workout Tracker</h1>
      <p className="text-gray-700">Track your workouts and stay fit!</p>
      {user && (
        <div className="mt-4">
          <p className=" lg:absolute lg:top-20 lg:left-4 bg-purple-950 px-4 py-2 rounded text-white mt-2 w-auto">Welcome Back {displayName.toUpperCase()}</p>
          <button onClick={signOut} className="mt-2 bg-red-500 text-red-100 px-4 py-2 rounded lg:absolute lg:top-20 lg:right-4 hover:bg-red-600 ">
            Sign Out
          </button>
        </div>
      )}
      </div>
      <div className='mt-6 p-4 bg-white rounded-lg shadow-md font-serif'>
        <div key={exercise.id}>
          <div className='bg-sky-300 rounded-lg p-2 mb-2 items-center justify-between'>
          <h2 className='text-xl font-semibold mb-2 inline rounded-lg'><img src={dumbbell} alt="dumbbell" className='logo rounded-lg w-40 h-20 inline mr-2 sm:mr-4 xs:w-20 xs:h-10 sm:h-10 sm:w-15 lg:w-50 lg:h-20 md:w-40 md:h-20 lg:mr-6' />Scheduled Exercises</h2>
          </div>
          <h4 className='text-xl bg-amber-100 m-1.5 rounded-2xl'>Upcoming Workouts</h4>
          <div className='flex mx-auto lg:p-4 lg:bg-white lg:rounded-lg lg:shadow-md mb-4 lg:border-l-4 lg:border-blue-500'>
              <div className='flex-4 mt-3 mr-1 ml-0.5'>
                {selectedExercises.length > 0 ? (
                  selectedExercises.map((ex) => (
                    <div key={ex.id} className='lg:p-4 lg:rounded-lg lg:shadow-sm mb-2 lg:flex sm:block lg:border-l-4 lg:border-green-500'>
                      <div className='p-4 bg-slate-100  rounded-lg shadow-sm mb-4 border flex-4'>
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
                      <div className='flex-1 gap-2 mt-5 lg:justify-end lg:flex sm:mt-6 sm:mb-3 '>
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
                <div key={ex.id} className='lg:flex sm:block mx-auto p-4 bg-white rounded-lg shadow-md mb-4 border-l-4 border-blue-500'>
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