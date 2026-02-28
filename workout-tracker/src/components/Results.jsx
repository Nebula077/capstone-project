import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import Footer from './Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../../supabase-client';

function Results() {
  const { user } = useAuth();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_WGER_API_BASE_URL || 'https://wger.de/api/v2/';

  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState('wger'); 
  const [loading, setLoading] = useState(false);
  const [wgerResults, setWgerResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [infoResult, setInfoResult] = useState(null);
  const [infoError, setInfoError] = useState(null);
  const [wgerError, setWgerError] = useState(null);
  const [userError, setUserError] = useState(null);

  // Read query + source from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query') || '';
    const src = params.get('source') || 'wger';

    setSearchQuery(q);
    setSource(src === 'saved' || src === 'info' ? src : 'wger');
  }, [location.search]);

  useEffect(() => {
    if (!searchQuery) {
      setWgerResults([]);
      setWgerError(null);
      return;
    }

    const fetchWger = async () => {
      try {
        setLoading(true);
        setWgerError(null);
        const response = await axios.get(`${BASE_URL}exerciseinfo/?limit=100`, {
          headers: { 'Content-Type': 'application/json' },
        });

        const normalizedQuery = searchQuery.toLowerCase();

        const filtered = response.data.results.filter((exercise) => {
          const englishName =
            exercise.translations.find((t) => t.language === 2)?.name ||
            exercise.name ||
            '';

          const musclesText = (exercise.muscles || [])
            .map((m) => m.name_en || '')
            .join(' ');

          const categoryText = exercise.category?.name || '';

          const haystack = `${englishName} ${musclesText} ${categoryText}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });

        if (filtered.length === 0) {
          setWgerError('No results found. Try a different search term.');
          setWgerResults([]);
        } else {
          setWgerResults(filtered);
          setWgerError(null);
        }
      } catch (error) {
        console.error('Error searching WGER:', error);
        setWgerError('Network error. Please try again.');
        setWgerResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (source === 'wger') {
      fetchWger();
    }
  }, [BASE_URL, searchQuery, source]);

  // Fetch user_exercises filtered by searchQuery
  useEffect(() => {
    const fetchUserExercises = async () => {
      if (!user || !searchQuery) {
        setUserResults([]);
        setUserError(null);
        return;
      }

      try {
        setLoading(true);
        setUserError(null);
        const { data, error } = await supabase
          .from('user_exercises')
          .select('*')
          .eq('user_id', user.id)
          .ilike('name', `%${searchQuery}%`);

        if (error) {
          console.error('Error searching user_exercises:', error);
          setUserError('Network error. Please try again.');
          setUserResults([]);
          return;
        }

        if (!data || data.length === 0) {
          setUserError('No saved exercises found.');
          setUserResults([]);
        } else {
          setUserResults(data);
          setUserError(null);
        }
      } catch (error) {
        console.error('Error fetching user exercises:', error);
        setUserError('Network error. Please try again.');
        setUserResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (source === 'saved') {
      fetchUserExercises();
    }
  }, [user, searchQuery, source]);

  // Fetch short info (Wikipedia summary) for the exercise name
  useEffect(() => {
    if (!searchQuery) {
      setInfoResult(null);
      setInfoError(null);
      return;
    }

    const fetchInfo = async () => {
      try {
        setLoading(true);
        setInfoError(null);
        setInfoResult(null);

        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            searchQuery
          )}`
        );

        if (!response.ok) {
          throw new Error('No results found for this search.');
        }

        const data = await response.json();
        setInfoResult(data);
      } catch (error) {
        console.error('Error fetching info:', error);
        setInfoError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (source === 'info') {
      fetchInfo();
    }
  }, [searchQuery, source]);

  const handleAddExercise = async (exercise) => {
    if (!user) {
      alert('Please log in to save exercises.');
      return;
    }

    const englishName =
      (exercise.translations &&
        exercise.translations.find((t) => t.language === 2)?.name) ||
      exercise.name;

    const imageUrls = exercise.images?.map((img) => img.image) ?? [];
    const muscleNames = exercise.muscles?.map((m) => m.name_en) ?? [];

    const { data: existing } = await supabase
      .from('user_exercises')
      .select('id')
      .eq('user_id', user.id)
      .eq('exercise_id', exercise.id)
      .maybeSingle();

    if (existing) {
      alert('This exercise is already saved.');
      return;
    }

    const { error } = await supabase.from('user_exercises').insert({
      user_id: user.id,
      exercise_id: exercise.id,
      name: englishName,
      category: exercise.category?.name ?? null,
      description: exercise.description ?? null,
      images: imageUrls,
      muscles: muscleNames,
    });

    if (error) {
      console.error('Error saving exercise:', error);
      alert('Could not save exercise. Please try again.');
    } else {
      alert('Exercise saved!');
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div>
      <NavBar />
      <div className="mt-6 p-4 bg-white rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{searchQuery}"
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-2 rounded ${
              source === 'wger' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSource('wger')}
          >
            WGER
          </button>
          <button
            className={`px-3 py-2 rounded ${
              source === 'saved' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSource('saved')}
          >
            My Saved
          </button>
          <button
            className={`px-3 py-2 rounded ${
              source === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSource('info')}
          >
            Info
          </button>
        </div>

        {loading && <p className="text-gray-600 text-center py-8">Loading...</p>}

        {/* WGER Results */}
        {!loading && source === 'wger' && (
          <>
            {wgerError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-700 font-semibold mb-2">{wgerError}</p>
                {wgerError.includes('Network') && (
                  <button
                    onClick={handleRetry}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
            {!wgerError && wgerResults.map((exercise) => {
              const englishName =
                exercise.translations.find((t) => t.language === 2)?.name ||
                exercise.name;

              return (
                <div key={exercise.id} className="flex mb-4">
                  <div className="p-4 bg-gray-100 rounded-lg shadow-sm w-full">
                    <h3 className="text-lg font-semibold">{englishName}</h3>
                    <h5>
                      Muscles:{' '}
                      {exercise.muscles?.length > 0
                        ? exercise.muscles.map((m) => m.name_en).join(', ')
                        : 'N/A'}
                    </h5>
                    <h5>Category: {exercise.category?.name || 'N/A'}</h5>
                    {exercise.images?.length > 0 && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {exercise.images.map((image) => (
                          <img
                            key={image.id}
                            src={image.image}
                            alt={englishName}
                            className="w-full h-48 object-cover rounded-md mb-2"
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-gray-700">
                      Description: {exercise.description}
                    </p>
                    <button
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleAddExercise(exercise)}
                    >
                      Add to My Exercises
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Saved Exercises */}
        {!loading && source === 'saved' && (
          <>
            {userError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-700 font-semibold mb-2">{userError}</p>
                {userError.includes('Network') && (
                  <button
                    onClick={handleRetry}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
            {!userError && userResults.map((exercise) => (
              <div key={exercise.id} className="p-4 bg-gray-100 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <h5>Category: {exercise.category || 'N/A'}</h5>
                <h5>
                  Muscles:{' '}
                  {Array.isArray(exercise.muscles)
                    ? exercise.muscles.join(', ')
                    : 'N/A'}
                </h5>
                {Array.isArray(exercise.images) && exercise.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {exercise.images.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={exercise.name}
                        className="w-full h-48 object-cover rounded-md mb-2"
                      />
                    ))}
                  </div>
                )}
                <p className="text-gray-700">Description: {exercise.description}</p>
              </div>
            ))}
          </>
        )}

        {/* Info Results */}
        {!loading && source === 'info' && (
          <div className="p-4 bg-gray-100 rounded-lg shadow-sm mt-4">
            {infoError && (
              <div className="p-4 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-700 font-semibold mb-2">{infoError}</p>
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            )}
            {!infoError && !infoResult && (
              <p className="text-gray-700 text-sm">No additional information available.</p>
            )}
            {infoResult && (
              <div className="flex flex-col md:flex-row gap-4">
                {infoResult.thumbnail?.source && (
                  <img
                    src={infoResult.thumbnail.source}
                    alt={infoResult.title}
                    className="w-full md:w-48 h-48 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold mb-1">{infoResult.title}</h3>
                  {infoResult.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {infoResult.description}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm whitespace-pre-line">
                    {infoResult.extract}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Results;