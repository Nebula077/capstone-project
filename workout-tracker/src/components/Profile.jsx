import React from 'react';
import './profile.css';
import NavBar from "./NavBar";
import { useAuth } from "../context/AuthContext.jsx";
import supabase from '../../supabase-client';
import { useState, useEffect } from 'react';

function Profile() {
    const { user, profile, signOut } = useAuth();
    const [createdExercises, setCreatedExercises] = useState([]);

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

    if (!user) {
        return null;
    }

    const displayName = profile?.username || user.user_metadata?.username || user.user_metadata?.full_name || user.email;

    return (
        <div className=" mx-auto p-4  bg-gray-200 rounded-lg shadow-md">
            <NavBar />
            <article className="profile-card p-4 bg-white rounded-lg shadow-sm mb-4">
                <h2 className="text-xl font-semibold mb-2">Hello: {displayName}</h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">User ID: {user.id}</p>
                <button className="mt-3 border bg-red-500 border-gray-300 rounded px-4 py-2" onClick={signOut}>Sign Out</button>
            </article>

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
        </div>
    );
}

export default Profile;