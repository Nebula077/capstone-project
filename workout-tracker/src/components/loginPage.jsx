import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from './Footer.jsx';

export default function LoginPage() {
    const { user, loading: authLoading, authError, signInWithUsernamePassword, signOut } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

    // If already authenticated, send to profile
    useEffect(() => {
        if (!authLoading && user) {
            navigate("/profile", { replace: true });
        }
    }, [authLoading, user, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setStatus("sending");
        try {
            await signInWithUsernamePassword({ username, password });
            setStatus("sent");
            navigate("/profile", { replace: true });
        } catch (error) {
            setStatus("error");
            console.error("Error logging in", error);
        }
    };

    if (authLoading) {
        return <p>Loading authentication...</p>;
    }

    if (user) {
        return (
            <div className="p-4 bg-gray-100 min-h-screen">
                <h1>Welcome back!</h1>
                <p>You are logged in as: {user.email}</p>
                <button onClick={signOut} className="mt-2 bg-red-500 text-red-100 px-4 py-2 rounded hover:bg-red-600">Sign Out</button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1>Login</h1>
            <p>Enter your username and password.</p>
            <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto">
                <input
                    className="mb-4 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    type="text"
                    placeholder="Username"
                    value={username}
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="mb-4 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button disabled={status === "sending"} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    {status === "sending" ? <span>Logging in...</span> : <span>Log in</span>}
                </button>
            </form>
            {status === "sent" && <p>Logged in.</p>}
            {authError && <p>{authError}</p>}
            {status === "error" && <p>Login failed. Check your credentials and try again.</p>}
        <Footer />
        </div>
    );
}
