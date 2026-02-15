import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'

function logoutButton() {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <div>
            <button onClick={() => logout()}>Sign Out</button>
        </div>
    )
  )
}

export default logoutButton;