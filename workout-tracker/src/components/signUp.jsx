import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from './Footer.jsx';
import { Link } from "react-router-dom";

export default function SignUp() {
    const { user, loading: authLoading, authError, signUpWithEmailPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [bio, setBio] = useState("");
    const [status, setStatus] = useState("idle");
    const [fullName, setFullName] = useState("");
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
            await signUpWithEmailPassword({ email, password, username, bio, fullName });
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
        <div className="border-b border-gray-900/10 pb-12 space-y-12 flex flex-col shadow-md rounded-lg p-6 max-w-lg mx-auto mt-10 bg-gray-100 w-3/4">
            <h1 className="text-base/7 font-semibold text-gray-900">Create Account</h1>
            <p className="mt-1 text-sm/6 text-gray-600">Register with a username, email, and password.</p>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto">
                <form onSubmit={handleSignup}>
                    <div className="sm:col-span-4 p-1">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        type="text"
                        placeholder="Username"
                        value={username}
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                    <div className="sm:col-span-4 p-1">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>
                    <div className="sm:col-span-4 p-1">
                    <input 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        required
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    </div>
                    <div className="sm:col-span-4 p-1">
                    <input 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    type="text"
                    placeholder="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    />
                    </div>
                    <div className="sm:col-span-4 p-1">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        type="text"
                        placeholder="Bio (optional)"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    </div>
                    <div className="sm:col-span-4 p-1">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                    <div className="sm:col-span-4 p-1">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </div>
                    <button disabled={status === "sending"} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full" type="submit">
                        {status === "sending" ? <span>Creating...</span> : <span>Create account</span>}
                    </button>
                </form>
            </div>
            {status === "sent" && <p>Account created. You can now log in.</p>}
            {authError && <p>{authError}</p>}
            {status === "error" && <p>Could not create account. Check details and try again.</p>}
            <p>Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-600">Log in</Link></p>
        <Footer />
        </div>
    );
}
