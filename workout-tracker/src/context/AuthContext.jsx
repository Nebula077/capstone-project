import { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "../../supabase-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const loadSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                setAuthError(error.message);
            }
            setSession(data?.session ?? null);
            setLoading(false);
        };

        loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            setAuthError(null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.id) {
                setProfile(null);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("username,email")
                .eq("id", session.user.id)
                .maybeSingle();

            if (error) {
                setAuthError(error.message);
                setProfile(null);
                return;
            }

            setProfile(data ?? null);
        };

        fetchProfile();
    }, [session]);

    const signInWithEmailOtp = async (email) => {
        setAuthError(null);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/signup`,
            },
        });
        if (error) {
            setAuthError(error.message);
            throw error;
        }
    };

    const signUpWithEmailPassword = async ({ email, password, username }) => {
        setAuthError(null);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        });

        if (error) {
            setAuthError(error.message);
            throw error;
        }

        // Persist username in a profiles table (must exist with a unique username column)
        if (data?.user) {
            const { error: profileError } = await supabase.from("profiles").insert({
                id: data.user.id,
                email,
                username,
            });
            if (profileError) {
                setAuthError(profileError.message);
                throw profileError;
            }
        }

        return data;
    };

    const signInWithEmailPassword = async ({ email, password }) => {
        setAuthError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setAuthError(error.message);
            throw error;
        }
        return data;
    };

    const signInWithUsernamePassword = async ({ username, password }) => {
        setAuthError(null);
        // Look up the email for this username
        const { data, error } = await supabase
            .from("profiles")
            .select("email")
            .eq("username", username)
            .maybeSingle();

        if (error) {
            setAuthError(error.message);
            throw error;
        }

        if (!data?.email) {
            const notFoundError = new Error("Username not found");
            setAuthError(notFoundError.message);
            throw notFoundError;
        }

        return signInWithEmailPassword({ email: data.email, password });
    };

    const signOut = async () => {
        setAuthError(null);
        const { error } = await supabase.auth.signOut();
        if (error) {
            setAuthError(error.message);
            throw error;
        }
    };

    const value = useMemo(() => ({
        user: session?.user ?? null,
        session,
        loading,
        authError,
        signInWithEmailOtp,
        signUpWithEmailPassword,
        signInWithEmailPassword,
        signInWithUsernamePassword,
        signOut,
        profile,
    }), [session, loading, authError, profile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
