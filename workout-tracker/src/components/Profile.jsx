import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'
import './profile.css';
import NavBar from "./NavBar";

function Profile() {
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <div className="container mx-auto p-4 list-none bg-gray-200 rounded-lg shadow-md">
            <NavBar />
            <article className="profile-card p-4 bg-white rounded-lg shadow-sm">
                <img src={user.picture} alt={user.name} style={{ width: 50, height: 50 }} />
                <h2>{user.name}</h2>
                <ul className="list-none">
                    {Object.keys(user).map((key) => (
                        <li key={key}>
                            <strong>{key}: </strong> {user[key]}
                        </li>
                    ))}
                </ul>
            </article>
        </div>
    )
  )
}

export default Profile;