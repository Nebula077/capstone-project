import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import supabase from "../../supabase-client";

export default function EditProfile() {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | saving | success | error
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Load current profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setStatus("loading");
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("username, full_name, bio")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error loading profile:", fetchError);
        setError(fetchError.message);
        setStatus("error");
        return;
      }

      setUsername(data?.username || "");
      setFullName(data?.full_name || "");
      setBio(data?.bio || "");
      setStatus("idle");
      setProfile(data);
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setStatus("saving");
    setError(null);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: username.trim().toLowerCase(),
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      setError(updateError.message);
      setStatus("error");
      return;
    }

    // keep context in sync
    setProfile((prev) => ({
      ...(prev || {}),
      username: username.trim().toLowerCase(),
      full_name: fullName.trim() || null,
      bio: bio.trim() || null,
      email: (prev && prev.email) || user.email,
    }));

    setStatus("success");
    navigate("/profile", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <NavBar />
      <div className="max-w-lg mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-2">Edit Profile</h1>
        <p className="text-sm text-gray-600 mb-4">
          Update your username, full name, and bio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "saving"}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
          >
            {status === "saving" ? "Saving..." : "Save changes"}
          </button>

          {status === "loading" && (
            <p className="text-sm text-gray-500 mt-2">Loading profile...</p>
          )}
          {status === "success" && (
            <p className="text-sm text-green-600 mt-2">
              Profile updated successfully.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 mt-2">
              Could not update profile: {error}
            </p>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}