import NavBar from "./NavBar";
import { useAuth } from "../context/AuthContext.jsx";
import supabase from '../../supabase-client';
import { useState, useEffect } from 'react';
import Footer from './Footer.jsx';
import { Link } from "react-router-dom";

function Profile() {
    const { user, profile, signOut } = useAuth();
    const [createdExercises, setCreatedExercises] = useState([]);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [currentCompletedIndex, setCurrentCompletedIndex] = useState(0);
    const [userActivity, setUserActivity] = useState([]);
    const [expandedExercises, setExpandedExercises] = useState(new Set());
    const [expandedActivities, setExpandedActivities] = useState(new Set());
    const [showAllActivities, setShowAllActivities] = useState(false);

    useEffect(() => {
        if (!user) {
            setCreatedExercises([]);
            return;
        }

        const fetchExercises = async () => {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching user exercises:', error);
                return;
            }

            setCreatedExercises(data || []);
        };

        fetchExercises();
    }, [user]);

    useEffect(() => {
        if (!user) {
            setCompletedExercises([]);
            setCurrentCompletedIndex(0);
            setUserActivity([]);
            return;
        }

        const fetchCompleted = async () => {
            const { data, error } = await supabase
                .from('user_exercises')
                .select('*')
                .eq('user_id', user.id)
                .eq('completed', true)
                .order('completed_at', { ascending: false });

            if (error) {
                console.error('Error fetching completed exercises:', error);
                return;
            }

            setCompletedExercises(data || []);
            setCurrentCompletedIndex(0);
            setUserActivity(data || []);
        };

        fetchCompleted();
    }, [user]);

    if (!user) {
        return null;
    }

    const displayName =
        profile?.full_name ||
        profile?.username ||
        user.user_metadata?.username ||
        user.user_metadata?.full_name ||
        user.email;

    const currentCompleted =
        completedExercises.length > 0
            ? completedExercises[currentCompletedIndex]
            : null;

    const calculateTotalDuration = () => {
        return completedExercises.reduce((total, exercise) => {
            const duration = parseInt(exercise.duration) || 0;
            return total + duration;
        }, 0);
    };

    const toggleActivityExpand = (activityId) => {
        setExpandedActivities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(activityId)) {
                newSet.delete(activityId);
            } else {
                newSet.add(activityId);
            }
            return newSet;
        });
    };

    const toggleExerciseExpand = (exerciseId) => {
        setExpandedExercises(prev => {
            const newSet = new Set(prev);
            if (newSet.has(exerciseId)) {
                newSet.delete(exerciseId);
            } else {
                newSet.add(exerciseId);
            }
            return newSet;
        });
    };

    const getPreferredCategories = () => {
        const allCategories = new Set();
        
        createdExercises.forEach(ex => {
            if (ex.category) {
                allCategories.add(ex.category);
            }
        });
        
        completedExercises.forEach(ex => {
            if (ex.category) {
                allCategories.add(ex.category);
            }
        });
        
        return Array.from(allCategories);
    };

    return (
        <div className=" mx-auto p-4 font-serif bg-gray-200 rounded-lg shadow-md">
            <NavBar />
            <article className="profile-card p-4 bg-white rounded-lg shadow-sm mb-4">
                <h2 className="text-xl font-semibold mb-2">Hello: {displayName}</h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">User ID: {user.id}</p>
                <button className="mt-3 border bg-red-500 border-gray-300 rounded px-4 py-2" onClick={signOut}>Sign Out</button>
                
            </article>
            <div>
                <main className='flex-1'>
                    <div className='bg-white rounded-2xl shadow p-4 text-center mt-4'>
                        <h1 className='text-2xl font-bold mb-4'>Welcome to Your Profile</h1>
                        <div className='relative w-24 h-24 mx-auto'>
                            <img src="null" alt="Profile Picture" className="w-24 h-24 rounded-full mx-auto" />
                            <span className='absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full'></span>
                        </div>
                        <h2 className='text-2xl font-semibold mt-4'>{displayName}</h2>
                        <p>About: {profile?.bio || "No bio yet."}</p>
                        <button
                            className="mt-3 ml-2 border bg-blue-500 text-white border-gray-300 rounded px-4 py-2"
                        >
                            <Link to="/edit-profile">Edit Profile</Link>
                        </button>
                    </div>
                    
                    <div className='mt-6 rounded-2xl shadow p-4 bg-indigo-300 text-white'>
                        <h3 className='text-lg font-semibold mb-4 text-center'>Completed Activities</h3>
                        {completedExercises.length === 0 ? (
                            <p className='text-center text-sm'>You have no completed activities yet.</p>
                        ) : (
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4 mb-6'>
                                    <div className='bg-indigo-400 rounded-lg p-4 text-center'>
                                        <p className='text-sm opacity-90'>Total Duration</p>
                                        <p className='text-2xl font-bold'>{calculateTotalDuration()} min</p>
                                    </div>
                                    <div className='bg-indigo-400 rounded-lg p-4 text-center'>
                                        <p className='text-sm opacity-90'>Completed</p>
                                        <p className='text-2xl font-bold'>{completedExercises.length}</p>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    {completedExercises.map((exercise) => (
                                        <div key={exercise.id} className='bg-indigo-400 rounded-lg overflow-hidden'>
                                            <button
                                                onClick={() => toggleExerciseExpand(exercise.id)}
                                                className='w-full px-4 py-3 flex justify-between items-center hover:bg-indigo-500 transition-colors'
                                            >
                                                <span className='font-semibold text-left'>{exercise.name}</span>
                                                <span className='text-sm'>
                                                    {expandedExercises.has(exercise.id) ? '▼' : '▶'}
                                                </span>
                                            </button>
                                            {expandedExercises.has(exercise.id) && (
                                                <div className='px-4 py-3 bg-indigo-500 border-t border-indigo-300 space-y-2 text-sm'>
                                                    {exercise.category && (
                                                        <p><span className='font-semibold'>Category:</span> {exercise.category}</p>
                                                    )}
                                                    {exercise.duration && (
                                                        <p><span className='font-semibold'>Duration:</span> {exercise.duration} minutes</p>
                                                    )}
                                                    {exercise.completed_at && (
                                                        <p><span className='font-semibold'>Completed:</span> {new Date(exercise.completed_at).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='grid border border-l-2 p-4 shadow-md rounded-2xl mt-6 bg-white'>
                        <h2 className='text-xl font-semibold mb-4'>Preferred Categories</h2>
                        <div className='flex flex-wrap gap-4 justify-center animate-bounce accent-red-200'>
                            {getPreferredCategories().length > 0 ? getPreferredCategories().map((category, idx) => (
                                <div key={idx} className='p-2 bg-gray-100 rounded-lg shadow-sm shrink-0 border-l-4  border-blue-500 gap-0.5 items-center justify-center flex'>
                                    <p className='text-gray-700 text-lg font-medium items-center'>{category}</p>
                                </div>
                            )
                            ) : (
                                <p className='text-gray-500 text-sm'>No categories yet.</p>
                            )}
                        </div>
                    </div>
                    <div className='mt-6 rounded-2xl shadow p-4 bg-green-300 text-white'>
                        <h3 className='text-lg font-semibold mb-4 text-center'>Your Recent Activity</h3>
                        {userActivity.length === 0 ? (
                            <p className='text-center text-sm'>No recent activity. Start working out to see your progress here!</p>
                        ) : (
                            <div className='space-y-4'>
                                {/* Summary Stats */}
                                <div className='bg-green-400 rounded-lg p-4 text-center'>
                                    <p className='text-sm opacity-90'>Total Activities</p>
                                    <p className='text-2xl font-bold'>{userActivity.length}</p>
                                </div>

                                {/* Dropdown List */}
                                <div className='space-y-2'>
                                    {userActivity.slice(0, showAllActivities ? userActivity.length : 2).map((activity) => (
                                        <div key={activity.id} className='bg-green-400 rounded-lg overflow-hidden'>
                                            <button
                                                onClick={() => toggleActivityExpand(activity.id)}
                                                className='w-full px-4 py-3 flex justify-between items-center hover:bg-green-500 transition-colors'
                                            >
                                                <span className='font-semibold text-left'>{activity.name}</span>
                                                <span className='text-sm'>
                                                    {expandedActivities.has(activity.id) ? '▼' : '▶'}
                                                </span>
                                            </button>
                                            {expandedActivities.has(activity.id) && (
                                                <div className='px-4 py-3 bg-green-500 border-t border-green-300 space-y-2 text-sm'>
                                                    {activity.category && (
                                                        <p><span className='font-semibold'>Category:</span> {activity.category}</p>
                                                    )}
                                                    {activity.duration && (
                                                        <p><span className='font-semibold'>Duration:</span> {activity.duration} minutes</p>
                                                    )}
                                                    {activity.completed_at && (
                                                        <p><span className='font-semibold'>Completed:</span> {new Date(activity.completed_at).toLocaleString()}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Show More/Less Button */}
                                {userActivity.length > 2 && (
                                    <button
                                        onClick={() => setShowAllActivities(!showAllActivities)}
                                        className='w-full px-4 py-2 bg-green-400 hover:bg-green-500 rounded-lg font-semibold transition-colors'
                                    >
                                        {showAllActivities ? 'Show Less' : `Show More (${userActivity.length - 2} more)`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <section className="p-4 bg-white mt-4 mb-2 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Your Saved Exercises</h3>
                {createdExercises.length > 0 ? (
                    createdExercises.map((ex) => (
                        <div key={ex.id} className="mb-3 p-3 bg-gray-100 rounded">
                            <h4 className="font-semibold">{ex.name}</h4>
                            {ex.description && (
                                <p className="text-gray-700">Description: {ex.description}</p>
                            )}
                            {ex.category && (
                                <p className="text-gray-700">Category: {ex.category}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-700">You have not saved any exercises yet.</p>
                )}
            </section>
            <Footer />
        </div>
     
    );
}

export default Profile;