import React from 'react'
import NavBar from './NavBar';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import { useEffect } from 'react';
import Footer from './Footer.jsx';
import supabase from '../../supabase-client';
import { useNavigate } from 'react-router-dom';

function Workout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scheduledExercises, setScheduledExercises] = useState([]);
  const [savedExercises, setSavedExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({});
  const [completedExercises, setCompletedExercises] = useState(new Set());

  // Fetch scheduled exercises (user_exercises where completed=false)
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchScheduledExercises();
    fetchSavedExercises();
  }, [user]);

  const fetchScheduledExercises = async () => {
    const { data, error } = await supabase
      .from('user_exercises')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false);

    if (error) {
      console.error('Error fetching scheduled exercises:', error);
    } else {
      setScheduledExercises(data || []);
      // Initialize workout data for each exercise
      const initialData = {};
      data?.forEach(ex => {
        initialData[`scheduled-${ex.id}`] = {
          duration: ex.duration || '',
          reps: '',
          priority: 'medium'
        };
      });
      setWorkoutData(prev => ({ ...prev, ...initialData }));
    }
  };

  const fetchSavedExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching saved exercises:', error);
    } else {
      setSavedExercises(data || []);
      // Initialize workout data for each exercise
      const initialData = {};
      data?.forEach(ex => {
        initialData[`saved-${ex.id}`] = {
          duration: '',
          reps: '',
          priority: 'medium'
        };
      });
      setWorkoutData(prev => ({ ...prev, ...initialData }));
    }
  };

  const handleInputChange = (exerciseKey, field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      [exerciseKey]: {
        ...prev[exerciseKey],
        [field]: value
      }
    }));
  };

  const handleMarkComplete = async (exerciseId, exerciseKey, isScheduled) => {
    if (isScheduled) {
      // Update scheduled exercise as completed
      const { error } = await supabase
        .from('user_exercises')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          duration: workoutData[exerciseKey]?.duration,
        })
        .eq('id', exerciseId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking exercise complete:', error);
        alert('Could not mark as complete. Please try again.');
        return;
      }
    }

    // Add to completed set for visual feedback
    setCompletedExercises(prev => new Set(prev).add(exerciseKey));
    alert('Exercise marked as complete!');
  };

  const renderExercise = (exercise, type) => {
    const exerciseKey = `${type}-${exercise.id}`;
    const isCompleted = completedExercises.has(exerciseKey);
    const data = workoutData[exerciseKey] || { duration: '', reps: '', priority: 'medium' };

    return (
      <div 
        key={exerciseKey} 
        className={`p-4 bg-white rounded-lg shadow-md mb-4 border-l-4 ${
          data.priority === 'high' ? 'border-red-500' :
          data.priority === 'medium' ? 'border-yellow-500' :
          'border-green-500'
        } ${isCompleted ? 'opacity-50' : ''}`}
      >
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Exercise Info */}
          <div className='flex-1'>
            <h3 className={`text-lg font-semibold mb-2 ${isCompleted ? 'line-through' : ''}`}>
              {exercise.name}
            </h3>
            <p className='text-gray-600 text-sm mb-2'>Category: {exercise.category || 'N/A'}</p>
            {exercise.muscles && (
              <p className='text-gray-600 text-sm mb-2'>Muscles: {Array.isArray(exercise.muscles) ? exercise.muscles.join(', ') : exercise.muscles}</p>
            )}
            
            {/* Images */}
            {Array.isArray(exercise.images) && exercise.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {exercise.images.slice(0, 2).map((url, idx) => {
                  const fullUrl = url.startsWith('http') 
                    ? url.replace('http://', 'https://') 
                    : `https://wger.de${url}`;
                  return (
                    <img
                      key={idx}
                      src={fullUrl}
                      alt={exercise.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Workout Controls */}
          <div className='flex-1 space-y-3'>
            {/* Duration/Timer */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                placeholder="30"
                value={data.duration}
                onChange={(e) => handleInputChange(exerciseKey, 'duration', e.target.value)}
                disabled={isCompleted}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
              />
            </div>

            {/* Sets/Reps */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Sets x Reps (e.g., 3x10)
              </label>
              <input
                type="text"
                placeholder="3x10"
                value={data.reps}
                onChange={(e) => handleInputChange(exerciseKey, 'reps', e.target.value)}
                disabled={isCompleted}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
              />
            </div>

            {/* Priority */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Priority
              </label>
              <select
                value={data.priority}
                onChange={(e) => handleInputChange(exerciseKey, 'priority', e.target.value)}
                disabled={isCompleted}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100'
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Complete Button */}
            <button
              onClick={() => handleMarkComplete(exercise.id, exerciseKey, type === 'scheduled')}
              disabled={isCompleted}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                isCompleted 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isCompleted ? '✓ Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <NavBar />
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Workout Session</h1>
            <p className='text-gray-600'>Track your exercises and log your progress</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
          >
            Back to Home
          </button>
        </div>

        {/* Scheduled Exercises */}
        {scheduledExercises.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4 flex items-center'>
              <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-3'>
                {scheduledExercises.length}
              </span>
              Scheduled Exercises
            </h2>
            {scheduledExercises.map(ex => renderExercise(ex, 'scheduled'))}
          </div>
        )}

        {/* Saved Exercises */}
        {savedExercises.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4 flex items-center'>
              <span className='bg-purple-500 text-white px-3 py-1 rounded-full text-sm mr-3'>
                {savedExercises.length}
              </span>
              My Saved Exercises
            </h2>
            {savedExercises.map(ex => renderExercise(ex, 'saved'))}
          </div>
        )}

        {/* Empty State */}
        {scheduledExercises.length === 0 && savedExercises.length === 0 && (
          <div className='text-center py-12 bg-white rounded-lg shadow-md'>
            <p className='text-gray-500 text-lg mb-4'>No exercises found for your workout session.</p>
            <button
              onClick={() => navigate('/exercises')}
              className='bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600'
            >
              Browse Exercise Library
            </button>
          </div>
        )}

        {/* Summary */}
        {(scheduledExercises.length > 0 || savedExercises.length > 0) && (
          <div className='bg-blue-50 p-4 rounded-lg mb-4'>
            <h3 className='font-semibold mb-2'>Workout Summary</h3>
            <p className='text-sm text-gray-700'>
              Completed: {completedExercises.size} / {scheduledExercises.length + savedExercises.length} exercises
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Workout