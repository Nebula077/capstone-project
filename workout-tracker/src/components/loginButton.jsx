import { useAuth0 } from "@auth0/auth0-react";
import React from 'react'

function loginButton() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
        <div>
            <button onClick={() => loginWithRedirect()}>Sign In</button>
        </div>
    )
  )
}

export default loginButton;