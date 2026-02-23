import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignUp() {
    const { user, loading: authLoading, authError, signUpWithEmailPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

    // If already authenticated, send to profile
    useEffect(() => {
        if (!authLoading && user) {
            navigate("/profile", { replace: true });
        }
    }, [authLoading, user, navigate]);

    const handleSignup = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setStatus("error");
            return;
        }
        setStatus("sending");
        try {
            await signUpWithEmailPassword({ email, password, username });
            setStatus("sent");
            // After successful sign-up, redirect to login
            navigate("/login", { replace: true });
        } catch (error) {
            setStatus("error");
            console.error("Error creating account", error);
        }
    };

    if (authLoading) {
        return <p>Loading authentication...</p>;
    }

    if (user) {
        return null;
    }

    return (
        <div>
            <h1>Create Account</h1>
            <p>Register with a username, email, and password.</p>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    required
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button disabled={status === "sending"}>
                    {status === "sending" ? <span>Creating...</span> : <span>Create account</span>}
                </button>
            </form>
            {status === "sent" && <p>Account created. You can now log in.</p>}
            {authError && <p>{authError}</p>}
            {status === "error" && <p>Could not create account. Check details and try again.</p>}
        </div>
    );
}
