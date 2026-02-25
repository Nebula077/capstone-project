import React from 'react';
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

    return (
        <div className=" mx-auto p-4  bg-gray-200 rounded-lg shadow-md">
            <NavBar />
            <article className="profile-card p-4 bg-white rounded-lg shadow-sm mb-4">
                <h2 className="text-xl font-semibold mb-2">Hello: {displayName}</h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">User ID: {user.id}</p>
                <button className="mt-3 border bg-red-500 border-gray-300 rounded px-4 py-2" onClick={signOut}>Sign Out</button>
                
            </article>
            <div>
                <main className='flex-1 p-10'>
                    <div className='bg-white rounded-2xl shadow p-8 text-center'>
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
                    <div className='mt-6 rounded-2xl shadow p-8 bg-indigo-300 text-white'>
                        <h3 className='text-lg font-semibold mb-4 text-center'>Completed activities</h3>
                        {completedExercises.length === 0 || !currentCompleted ? (
                            <p className='text-center text-sm'>You have no completed activities yet.</p>
                        ) : (
                            <div className='flex flex-col items-center'>
                                <div className='w-full max-w-md bg-indigo-400 rounded-xl p-4 shadow-md text-left'>
                                    <h4 className='text-md font-semibold mb-1'>{currentCompleted.name}</h4>
                                    {currentCompleted.category && (
                                        <p className='text-sm'>Category: {currentCompleted.category}</p>
                                    )}
                                    {currentCompleted.muscles && (
                                        <p className='text-sm'>Muscles: {Array.isArray(currentCompleted.muscles) ? currentCompleted.muscles.join(', ') : currentCompleted.muscles}</p>
                                    )}
                                    {currentCompleted.completed_at && (
                                        <p className='text-xs mt-2'>Completed on: {new Date(currentCompleted.completed_at).toLocaleString()}</p>
                                    )}
                                </div>
                                <div className='flex justify-between items-center w-full max-w-md mt-4'>
                                    <button
                                        type='button'
                                        className='px-3 py-1 bg-indigo-500 rounded disabled:opacity-50'
                                        onClick={() =>
                                            setCurrentCompletedIndex((prev) =>
                                                prev === 0 ? completedExercises.length - 1 : prev - 1
                                            )
                                        }
                                        disabled={completedExercises.length <= 1}
                                    >
                                        Previous
                                    </button>
                                    <span className='text-xs'>
                                        {currentCompletedIndex + 1} of {completedExercises.length}
                                    </span>
                                    <button
                                        type='button'
                                        className='px-3 py-1 bg-indigo-500 rounded disabled:opacity-50'
                                        onClick={() =>
                                            setCurrentCompletedIndex((prev) =>
                                                prev === completedExercises.length - 1 ? 0 : prev + 1
                                            )
                                        }
                                        disabled={completedExercises.length <= 1}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <section className="p-4 bg-white rounded-lg shadow-sm">
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