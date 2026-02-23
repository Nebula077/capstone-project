import React from 'react';
import './profile.css';
import NavBar from "./NavBar";
import { useAuth } from "../context/AuthContext.jsx";

function Profile() {
    const { user, profile, signOut } = useAuth();

    if (!user) {
        return null;
    }

    const displayName = profile?.username || user.user_metadata?.username || user.user_metadata?.full_name || user.email;

    return (
        <div className="container mx-auto p-4 list-none bg-gray-200 rounded-lg shadow-md min-h-screen">
            <NavBar />
            <article className="profile-card p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-2">{displayName}</h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">User ID: {user.id}</p>
                <button className="mt-3 border bg-red-500 border-gray-300 rounded px-4 py-2" onClick={signOut}>Sign Out</button>
            </article>
        </div>
    );
}

export default Profile;